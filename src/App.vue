<template>
  <div class="task-manager">
    <header class="header">
      <h1>Simple TODO Task</h1>
      <p class="subtitle">for Neosoft</p>
    </header>

    <main class="main-content">
      <section class="add-task-section">
        <div class="input-group">
          <input
            v-model="newTaskTitle"
            @keyup.enter="handleAddTask"
            type="text"
            placeholder="Добавить новую задачу..."
            class="task-input"
            :disabled="isLoading"
          />
          <button
            @click="handleAddTask"
            :disabled="!newTaskTitle.trim() || isLoading"
            class="add-button"
          >
            {{ isLoading ? "Добавление..." : "Добавить" }}
          </button>
        </div>
      </section>

      <!-- Filters -->
      <section class="filters-section">
        <div class="filter-buttons">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="setCurrentFilter(filter.value)"
            :class="['filter-btn', { active: currentFilter === filter.value }]"
          >
            {{ filter.label }}
            <span class="count"
              >({{ getTaskCountByFilter(filter.value) }})</span
            >
          </button>
        </div>
      </section>

      <!-- Loading State -->
      <div v-if="isLoading && !tasks.length" class="loading">
        <div class="spinner"></div>
        <p>Загрузка задач...</p>
      </div>

      <!-- Tasks List -->
      <section v-else class="tasks-section">
        <div v-if="!filteredTasks.length" class="empty-state">
          <p v-if="!tasks.length">Пока нет задач. Добавьте первую!</p>
          <p v-else>Нет задач в категории "{{ getCurrentFilterLabel }}"</p>
        </div>

        <div v-else class="tasks-list">
          <div
            v-for="task in filteredTasks"
            :key="task.id"
            :class="['task-item', { completed: task.completed }]"
          >
            <div class="task-content">
              <label class="checkbox-wrapper">
                <input
                  type="checkbox"
                  :checked="task.completed"
                  @change="handleToggleTask(task.id)"
                  class="task-checkbox"
                />
                <span class="checkmark"></span>
              </label>

              <span class="task-title">{{ task.title }}</span>
            </div>

            <button
              @click="handleDeleteTask(task.id)"
              class="delete-button"
              :disabled="isLoading"
              title="Удалить задачу"
            >
              ✕
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { FilterType } from "./types/task";
import { useStore } from "vuex";

const store = useStore();

const newTaskTitle = ref("");

const filters = [
  { value: "all" as FilterType, label: "Все" },
  { value: "active" as FilterType, label: "Активные" },
  { value: "completed" as FilterType, label: "Выполненные" },
];

const tasks = computed(() => store.state.tasks);
const isLoading = computed(() => store.state.isLoading);
const currentFilter = computed(() => store.state.currentFilter);
const filteredTasks = computed(() => store.getters.filteredTasks);

const getCurrentFilterLabel = computed(() => {
  const filter = filters.find((f) => f.value === currentFilter.value);
  return filter?.label || "Все";
});

const handleAddTask = async () => {
  if (!newTaskTitle.value.trim()) return;

  await store.dispatch("addTask", newTaskTitle.value);
  newTaskTitle.value = "";
};

const handleDeleteTask = async (taskId: number) => {
  await store.dispatch("deleteTask", taskId);
};

const handleToggleTask = async (taskId: number) => {
  await store.dispatch("toggleTask", taskId);
};

const setCurrentFilter = (filter: FilterType) => {
  store.dispatch("setFilter", filter);
};

const getTaskCountByFilter = (filter: FilterType) => {
  return store.getters.getTaskCountByFilter(filter);
};

onMounted(() => {
  store.dispatch("fetchTasks");
});
</script>

<style scoped>
.task-manager {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  border-radius: 26px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.header h1 {
  font-size: 2.5rem;
  margin: 0;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  margin: 10px 0 0 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.main-content {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.add-task-section {
  margin-bottom: 30px;
}

.input-group {
  display: flex;
  gap: 12px;
}

.task-input {
  flex: 1;
  padding: 14px 18px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  outline: none;
}

.task-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.task-input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.add-button {
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.add-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.add-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.filters-section {
  margin-bottom: 30px;
}

.filter-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 16px;
  border: 2px solid #e1e5e9;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-btn:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.filter-btn.active .count {
  background: rgba(255, 255, 255, 0.3);
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
  font-size: 18px;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.task-item:hover {
  background: #e9ecef;
  border-color: #dee2e6;
}

.task-item.completed {
  opacity: 0.7;
  background: #e8f5e8;
}

.task-item.completed:hover {
  background: #d4edda;
}

.task-content {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
}

.checkbox-wrapper {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.task-checkbox {
  opacity: 0;
  position: absolute;
  cursor: pointer;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.task-checkbox:checked + .checkmark {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border-color: #28a745;
}

.task-checkbox:checked + .checkmark::after {
  content: "✓";
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.task-title {
  font-size: 16px;
  color: #495057;
  transition: all 0.3s ease;
}

.task-item.completed .task-title {
  text-decoration: line-through;
  color: #6c757d;
}

.delete-button {
  width: 32px;
  height: 32px;
  border: none;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.3s ease;
  opacity: 0.7;
}

.delete-button:hover:not(:disabled) {
  opacity: 1;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.delete-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.stats {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #e9ecef;
  text-align: center;
  color: #6c757d;
  font-size: 14px;
}

@media (max-width: 768px) {
  .task-manager {
    padding: 10px;
  }

  .main-content {
    padding: 20px;
  }

  .input-group {
    flex-direction: column;
  }

  .filter-buttons {
    justify-content: center;
  }

  .task-item {
    padding: 12px 16px;
  }

  .header h1 {
    font-size: 2rem;
  }
}
</style>
