import { createStore, Store } from "vuex";
import { Task, TaskState, FilterType } from "@/types/task";
import { TaskAPI } from "@/api/taskApi";

export const store: Store<TaskState> = createStore({
  state: (): TaskState => ({
    tasks: [],
    isLoading: false,
    currentFilter: "all",
  }),

  mutations: {
    SET_TASKS(state, tasks: Task[]) {
      state.tasks = tasks;
    },

    ADD_TASK(state, task: Task) {
      state.tasks.push(task);
    },

    DELETE_TASK(state, taskId: number) {
      state.tasks = state.tasks.filter((task) => task.id !== taskId);
    },

    UPDATE_TASK(state, updatedTask: Task) {
      const index = state.tasks.findIndex((task) => task.id === updatedTask.id);
      if (index !== -1) {
        state.tasks[index] = updatedTask;
      }
    },

    SET_LOADING(state, loading: boolean) {
      state.isLoading = loading;
    },

    SET_FILTER(state, filter: FilterType) {
      state.currentFilter = filter;
    },
  },

  actions: {
    async fetchTasks({ commit }) {
      commit("SET_LOADING", true);
      try {
        const tasks = await TaskAPI.getTasks();
        commit("SET_TASKS", tasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async addTask({ commit }, title: string) {
      commit("SET_LOADING", true);
      try {
        const newTask = await TaskAPI.addTask(title);
        commit("ADD_TASK", newTask);
      } catch (error) {
        console.error("Failed to add task:", error);
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async deleteTask({ commit }, taskId: number) {
      commit("SET_LOADING", true);
      try {
        await TaskAPI.deleteTask(taskId);
        commit("DELETE_TASK", taskId);
      } catch (error) {
        console.error("Failed to delete task:", error);
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async toggleTask({ commit }, taskId: number) {
      commit("SET_LOADING", true);
      try {
        const task = store.state.tasks.find((t) => t.id === taskId);
        if (task) {
          const updatedTask = await TaskAPI.updateTask(taskId, {
            completed: !task.completed,
          });
          commit("UPDATE_TASK", updatedTask);
        }
      } catch (error) {
        console.error("Failed to toggle task:", error);
      } finally {
        commit("SET_LOADING", false);
      }
    },

    setFilter({ commit }, filter: FilterType) {
      commit("SET_FILTER", filter);
    },
  },

  getters: {
    filteredTasks: (state) => {
      switch (state.currentFilter) {
        case "active":
          return state.tasks.filter((task) => !task.completed);
        case "completed":
          return state.tasks.filter((task) => task.completed);
        default:
          return state.tasks;
      }
    },

    getTaskCountByFilter: (state) => (filter: FilterType) => {
      switch (filter) {
        case "active":
          return state.tasks.filter((task) => !task.completed).length;
        case "completed":
          return state.tasks.filter((task) => task.completed).length;
        default:
          return state.tasks.length;
      }
    },
  },
});
