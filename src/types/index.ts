import { Tables } from './supabase';

export type Profile = Tables<'profiles'>;

export type Project = Tables<'projects'> & {
    progress: number; // Override to ensure it's always a number
};

export type Task = Tables<'tasks'> & {
    assignee?: Profile | null;
};

export type CalendarEvent = Tables<'events'>;

export type Note = Tables<'notes'>;

export type ChatMessage = Tables<'chat_messages'> & {
    user: Profile | null;
};
