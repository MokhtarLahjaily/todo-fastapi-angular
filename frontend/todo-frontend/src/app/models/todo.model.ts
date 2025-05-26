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
  created_at?: Date;
  updated_at?: Date;
  due_date?: Date;
  priority: Priority;
  category?: string;
  is_editing?: boolean;
  last_modified_by?: string;
  version?: number;
  position?: number;
}

export interface TodoCreate {
  title: string;
  description?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  category?: string;
}

export interface TodoUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  position?: number;
}

export interface TodoStats {
  total: number;
  pending: number;
  completed: number;
  completion_rate: number;
} 
