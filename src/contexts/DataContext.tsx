import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Project, Task, Profile } from '../types';
import { TablesInsert } from '../types/supabase';

interface DataContextType {
  projects: Project[];
  tasks: Task[];
  profiles: Profile[];
  loading: boolean;
  error: string | null;
  fetchData: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredProjects: Project[];
  filteredTasks: Task[];
  filteredProfiles: Profile[];
  updateTaskStatus: (taskId: number, newStatus: Task['status']) => Promise<void>;
  addProject: (project: TablesInsert<'projects'>) => Promise<Project | null>;
  addTask: (task: TablesInsert<'tasks'>) => Promise<Task | null>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        { data: projectsData, error: projectsError },
        { data: tasksData, error: tasksError },
        { data: profilesData, error: profilesError }
      ] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('tasks').select('*, assignee:profiles(*)').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*')
      ]);

      if (projectsError) throw projectsError;
      if (tasksError) throw tasksError;
      if (profilesError) throw profilesError;

      setProjects(projectsData || []);
      setTasks(tasksData || []);
      setProfiles(profilesData || []);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addProject = async (project: TablesInsert<'projects'>) => {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding project:', error);
      setError('Failed to add project.');
      return null;
    }
    if (data) {
      setProjects(prev => [data as Project, ...prev]);
    }
    return data as Project;
  };

  const addTask = async (task: TablesInsert<'tasks'>) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select('*, assignee:profiles(*)')
      .single();

    if (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task.');
      return null;
    }
    if (data) {
      setTasks(prev => [data as Task, ...prev]);
    }
    return data as Task;
  };

  const updateTaskStatus = async (taskId: number, newStatus: Task['status']) => {
    const originalTasks = [...tasks];
    
    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (error) {
      console.error("Failed to update task status:", error);
      setError("Failed to update task. Please try again.");
      setTasks(originalTasks);
    }
  };

  const lowercasedSearchTerm = searchTerm.toLowerCase();

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(lowercasedSearchTerm) ||
    p.client?.toLowerCase().includes(lowercasedSearchTerm)
  );

  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(lowercasedSearchTerm) ||
    t.description?.toLowerCase().includes(lowercasedSearchTerm)
  );

  const filteredProfiles = profiles.filter(p =>
    p.full_name?.toLowerCase().includes(lowercasedSearchTerm) ||
    p.username?.toLowerCase().includes(lowercasedSearchTerm) ||
    p.role?.toLowerCase().includes(lowercasedSearchTerm)
  );

  return (
    <DataContext.Provider value={{
      projects,
      tasks,
      profiles,
      loading,
      error,
      fetchData,
      searchTerm,
      setSearchTerm,
      filteredProjects,
      filteredTasks,
      filteredProfiles,
      updateTaskStatus,
      addProject,
      addTask,
    }}>
      {children}
    </DataContext.Provider>
  );
};
