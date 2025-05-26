export interface Todo {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface TodoCreate {
    title: string;
    description?: string;
    completed: boolean;
  }
  
  export interface TodoUpdate {
    title?: string;
    description?: string;
    completed?: boolean;
  }
  
  export interface TodoStats {
    total: number;
    pending: number;
    completed: number;
    completion_rate: number;
  } 
