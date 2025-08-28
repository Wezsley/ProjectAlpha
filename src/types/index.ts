// These types can be expanded based on your Supabase schema
// For now, they are simplified to match the core functionality

export interface Profile {
  id: string; // uuid
  updated_at?: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
  role?: string;
}

export interface Project {
  id: number; // bigserial
  created_at?: string;
  name: string;
  description?: string;
  client?: string;
  status?: 'active' | 'completed' | 'on-hold' | 'draft';
  progress?: number;
  deadline?: string;
  owner_id?: string; // uuid
}

export interface Task {
  id: number; // bigserial
  created_at?: string;
  title: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'review' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
  assignee_id?: string; // uuid
  project_id?: number; // bigint
  assignee?: Profile; // for joined data
  project?: Project; // for joined data
}

// You can add more types here for comments, files, etc. as you build them out.
