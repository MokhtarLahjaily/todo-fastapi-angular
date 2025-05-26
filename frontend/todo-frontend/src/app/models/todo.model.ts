export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Todo {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  due_date?: Date | string;
  created_at: Date | string;
  updated_at?: Date;
  category?: string;
  is_editing?: boolean;
  last_modified_by?: string;
  version?: number;
  position?: number;
}

export interface TodoCreate {
  title: string;
  description?: string;
  priority?: Priority;
  due_date?: string | null;
  completed?: boolean;
}

export interface TodoUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
  due_date?: string;
  priority?: Priority;
  category?: string;
  position?: number;
}

export interface TodoStats {
  total: number;
  pending: number;
  completed: number;
  completion_rate: number;
} 
