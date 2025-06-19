import { Task } from "@/types/task";

export class TaskAPI {
  private static tasks: Task[] = [
    { id: 1, title: "Прочитать вакансию", completed: true },
    { id: 2, title: "Откликнуться на вакансию", completed: true },
    { id: 3, title: "Сделать тз", completed: true },
    { id: 4, title: "Пройти собеседования", completed: false },
    { id: 5, title: "Получить оффер", completed: false },
  ];

  static async getTasks(): Promise<Task[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.tasks]);
      }, 800);
    });
  }

  static async addTask(title: string): Promise<Task> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTask: Task = {
          id: Date.now(),
          title: title.trim(),
          completed: false,
        };
        this.tasks.push(newTask);
        resolve(newTask);
      }, 500);
    });
  }

  static async deleteTask(id: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.tasks = this.tasks.filter((task) => task.id !== id);
        resolve();
      }, 300);
    });
  }

  static async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const taskIndex = this.tasks.findIndex((task) => task.id === id);
        if (taskIndex === -1) {
          reject(new Error("Task not found"));
          return;
        }

        this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
        resolve(this.tasks[taskIndex]);
      }, 300);
    });
  }
}
