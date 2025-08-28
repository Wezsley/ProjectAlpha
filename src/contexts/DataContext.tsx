import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Project, Task, Profile, CalendarEvent, Note, ChatMessage } from '../types';
import { Tables, TablesInsert, TablesUpdate } from '../types/supabase';

interface DataContextType {
  projects: Project[];
  tasks: Task[];
  profiles: Profile[];
  events: CalendarEvent[];
  notes: Note[];
  chatMessages: ChatMessage[];
  currentUserProfile: Profile | null;
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
  addEvent: (event: TablesInsert<'events'>) => Promise<CalendarEvent | null>;
  addNote: (note: TablesInsert<'notes'>) => Promise<Note | null>;
  deleteNote: (noteId: number) => Promise<void>;
  addChatMessage: (message: TablesInsert<'chat_messages'>) => Promise<void>;
  updateProfile: (updates: TablesUpdate<'profiles'>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string | null>;
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
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const calculateProjectProgress = (allProjects: Tables<'projects'>[], allTasks: Tables<'tasks'>[]): Project[] => {
    return allProjects.map(p => {
      const projectTasks = allTasks.filter(t => t.project_id === p.id);
      const completedTasks = projectTasks.filter(t => t.status === 'completed');
      const progress = projectTasks.length > 0 ? Math.round((completedTasks.length / projectTasks.length) * 100) : 0;
      return { ...p, progress };
    });
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const [
        { data: projectsData, error: projectsError },
        { data: tasksData, error: tasksError },
        { data: profilesData, error: profilesError },
        { data: eventsData, error: eventsError },
        { data: notesData, error: notesError },
        { data: chatMessagesData, error: chatMessagesError },
      ] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*'),
        supabase.from('events').select('*').order('start_time', { ascending: true }),
        supabase.from('notes').select('*').order('created_at', { ascending: false }),
        supabase.from('chat_messages').select('*').order('created_at', { ascending: true }),
      ]);

      if (projectsError) throw projectsError;
      if (tasksError) throw tasksError;
      if (profilesError) throw profilesError;
      if (eventsError) throw eventsError;
      if (notesError) throw notesError;
      if (chatMessagesError) throw chatMessagesError;
      
      const profilesMap = new Map((profilesData || []).map(p => [p.id, p]));

      const enrichedTasks: Task[] = (tasksData || []).map(task => ({
        ...task,
        assignee: task.assignee_id ? profilesMap.get(task.assignee_id) || null : null,
      }));

      const enrichedChatMessages: ChatMessage[] = (chatMessagesData || []).map(msg => ({
        ...msg,
        user: msg.user_id ? profilesMap.get(msg.user_id) || null : null,
      }));

      setTasks(enrichedTasks);
      setChatMessages(enrichedChatMessages);
      setProjects(calculateProjectProgress(projectsData || [], tasksData || []));
      setProfiles(profilesData || []);
      setEvents(eventsData || []);
      setNotes(notesData || []);
      
      if (user && profilesData) {
        setCurrentUserProfile(profilesData.find(p => p.id === user.id) || null);
      }

    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const channel = supabase.channel('realtime-updates');
    channel
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        console.log('Change received!', payload);
        fetchData(); // Refetch all data on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  const addProject = async (project: TablesInsert<'projects'>) => {
    const { data, error } = await supabase.from('projects').insert(project).select().single();
    if (error) { console.error('Error adding project:', error); setError('Failed to add project.'); return null; }
    return data as Project;
  };

  const addTask = async (task: TablesInsert<'tasks'>) => {
    const { data, error } = await supabase.from('tasks').insert(task).select().single();
    if (error) { console.error('Error adding task:', error); setError('Failed to add task.'); return null; }
    return data as Task;
  };

  const addEvent = async (event: TablesInsert<'events'>) => {
    const { data, error } = await supabase.from('events').insert(event).select().single();
    if (error) { console.error('Error adding event:', error); setError('Failed to add event.'); return null; }
    return data as CalendarEvent;
  };

  const addNote = async (note: TablesInsert<'notes'>) => {
    const { data, error } = await supabase.from('notes').insert(note).select().single();
    if (error) { console.error('Error adding note:', error); setError('Failed to add note.'); return null; }
    return data as Note;
  };

  const deleteNote = async (noteId: number) => {
    const { error } = await supabase.from('notes').delete().eq('id', noteId);
    if (error) { console.error('Error deleting note:', error); setError('Failed to delete note.'); }
  };

  const addChatMessage = async (message: TablesInsert<'chat_messages'>) => {
    const { error } = await supabase.from('chat_messages').insert(message);
    if (error) { console.error('Error sending message:', error); setError('Failed to send message.'); }
  };

  const updateTaskStatus = async (taskId: number, newStatus: Task['status']) => {
    const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
    if (error) { console.error("Failed to update task status:", error); setError("Failed to update task."); }
  };

  const updateProfile = async (updates: TablesUpdate<'profiles'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not authenticated"); return; }
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    if (error) { console.error("Failed to update profile:", error); setError("Failed to update profile."); }
  };
  
  const uploadAvatar = async (file: File) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not authenticated"); return null; }
    
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${Math.random()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
    if (uploadError) { console.error('Error uploading avatar:', uploadError); setError('Failed to upload avatar.'); return null; }
    
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const lowercasedSearchTerm = searchTerm.toLowerCase();
  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(lowercasedSearchTerm) || p.client?.toLowerCase().includes(lowercasedSearchTerm));
  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(lowercasedSearchTerm) || t.description?.toLowerCase().includes(lowercasedSearchTerm));
  const filteredProfiles = profiles.filter(p => p.full_name?.toLowerCase().includes(lowercasedSearchTerm));

  return (
    <DataContext.Provider value={{
      projects, tasks, profiles, events, notes, chatMessages, currentUserProfile,
      loading, error, fetchData, searchTerm, setSearchTerm,
      filteredProjects, filteredTasks, filteredProfiles,
      updateTaskStatus, addProject, addTask, addEvent, addNote, deleteNote, addChatMessage, updateProfile, uploadAvatar,
    }}>
      {children}
    </DataContext.Provider>
  );
};
