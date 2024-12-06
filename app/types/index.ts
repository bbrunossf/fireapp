export interface Employee {
    id: string;
    name: string;
    email: string;
    role: string;
    hourlyRate: number;
  }
  
  export interface Project {
    id: string;
    name: string;
    client: string;
    description: string;
    status: 'active' | 'completed' | 'on-hold';
  }
  
  export interface Task {
    id: string;
    projectId: string;
    name: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
  }
  
  export interface TimeEntry {
    id: string;
    employeeId: string;
    projectId: string;
    taskId: string;
    date: Date;
    hours: number;
    description: string;
    created: Date;
    modified: Date;
  }