/*
          # Initial Schema Setup
          This script sets up the foundational tables for the StudioBoard application, including user profiles, projects, and tasks. It also establishes security rules to protect your data.

          ## Query Description: 
          This operation is safe and foundational. It creates new tables and sets up security policies without altering or deleting any existing data. It's designed to build the database structure from a clean slate.

          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true

          ## Structure Details:
          - **Tables Created**: `profiles`, `projects`, `tasks`.
          - **Functions Created**: `handle_new_user()` to automate profile creation.
          - **Triggers Created**: A trigger on `auth.users` that calls `handle_new_user()`.
          
          ## Security Implications:
          - RLS Status: Enabled on all new tables.
          - Policy Changes: Yes, new policies are created to ensure users can only access their own data.
          - Auth Requirements: All data access is tied to authenticated users.
          
          ## Performance Impact:
          - Indexes: Primary keys and foreign keys are indexed by default.
          - Triggers: One trigger is added for new user setup, which has a negligible performance impact.
          - Estimated Impact: Low. This is a standard setup for a new application.
          */

-- 1. PROFILES TABLE
-- Stores public user data, linked to Supabase Auth.
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments for Profiles table
COMMENT ON TABLE public.profiles IS 'Stores public user data, linked to Supabase Auth.';
COMMENT ON COLUMN public.profiles.id IS 'Links to the auth.users table.';

-- 2. PROJECTS TABLE
-- Stores project information.
CREATE TABLE public.projects (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft',
  client TEXT,
  progress INT DEFAULT 0,
  deadline TIMESTAMPTZ,
  budget NUMERIC,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Comments for Projects table
COMMENT ON TABLE public.projects IS 'Stores all project information for the dashboard.';

-- 3. TASKS TABLE
-- Stores tasks, linked to projects and users.
CREATE TABLE public.tasks (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'medium',
  due_date TIMESTAMPTZ,
  project_id BIGINT REFERENCES public.projects(id) ON DELETE CASCADE,
  assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Comments for Tasks table
COMMENT ON TABLE public.tasks IS 'Stores individual tasks for each project.';

-- 4. AUTOMATIC PROFILE CREATION
-- Function to create a profile for a new user.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    'Member'
  );
  RETURN new;
END;
$$;

-- Trigger to call the function when a new user signs up.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. ROW LEVEL SECURITY (RLS)
-- Enable RLS for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- RLS Policies for Projects
CREATE POLICY "Users can view their own projects."
  ON public.projects FOR SELECT
  USING ( auth.uid() = owner_id );

CREATE POLICY "Users can create projects."
  ON public.projects FOR INSERT
  WITH CHECK ( auth.uid() = owner_id );

CREATE POLICY "Users can update their own projects."
  ON public.projects FOR UPDATE
  USING ( auth.uid() = owner_id );

CREATE POLICY "Users can delete their own projects."
  ON public.projects FOR DELETE
  USING ( auth.uid() = owner_id );

-- RLS Policies for Tasks
CREATE POLICY "Users can view tasks in their projects."
  ON public.tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.projects
      WHERE projects.id = tasks.project_id AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tasks in their projects."
  ON public.tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.projects
      WHERE projects.id = tasks.project_id AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks in their projects."
  ON public.tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM public.projects
      WHERE projects.id = tasks.project_id AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tasks in their projects."
  ON public.tasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM public.projects
      WHERE projects.id = tasks.project_id AND projects.owner_id = auth.uid()
    )
  );
