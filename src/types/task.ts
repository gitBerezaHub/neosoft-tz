export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export type FilterType = "all" | "active" | "completed";

export interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  currentFilter: FilterType;
}
