export interface AddTaskResponseInterface {
  message: string;
}

export interface Task {
  id: number;
  titleTask: string;
  description: string | null;
  is_done: boolean;
  priority: string;
  dueDate: string | null;
}

export interface GetAllTaskResponseInterface {
  total: number;
  ongoing: number;
  completed: number;
  result: Task[];
}
