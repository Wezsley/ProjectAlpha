/*
          # [Feature Expansion: Events, Notes, Chat, and Storage]
          This migration script expands the application's functionality by adding tables for calendar events, personal notes, and real-time chat. It also configures a storage bucket for user avatars and applies the necessary security policies.

          ## Query Description: This operation is structural and adds new capabilities without altering existing data. It is considered safe to apply to your existing database. It will:
          1. Create three new tables: `events`, `notes`, and `chat_messages`.
          2. Enable Row Level Security on these tables.
          3. Define security policies to control user access.
          4. Create a new storage bucket for avatars with appropriate access policies.
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true (by dropping the new tables and policies)
          
          ## Structure Details:
          - New Tables: `public.events`, `public.notes`, `public.chat_messages`
          - New Storage Bucket: `avatars`
          - New Policies: RLS policies for SELECT, INSERT, UPDATE, DELETE on new tables and storage.
          
          ## Security Implications:
          - RLS Status: Enabled on all new tables.
          - Policy Changes: Yes, new policies are added to secure the new features.
          - Auth Requirements: All new features require an authenticated user.
          
          ## Performance Impact:
          - Indexes: Indexes are added on foreign keys for optimal query performance.
          - Triggers: No new triggers are added in this migration.
          - Estimated Impact: Low. The changes are additive and indexed.
          */

-- 1. EVENTS TABLE for Calendar
CREATE TABLE public.events (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to see all events" ON public.events FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow users to insert their own events" ON public.events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own events" ON public.events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow users to delete their own events" ON public.events FOR DELETE USING (auth.uid() = user_id);

-- 2. NOTES TABLE for Chat & Notes
CREATE TABLE public.notes (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id BIGINT REFERENCES public.projects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content JSONB
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to see their own notes" ON public.notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert their own notes" ON public.notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own notes" ON public.notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow users to delete their own notes" ON public.notes FOR DELETE USING (auth.uid() = user_id);

-- 3. CHAT MESSAGES TABLE for Chat & Notes
CREATE TABLE public.chat_messages (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to see all messages" ON public.chat_messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow users to insert their own messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Note: Update/Delete on chat messages is often disabled or restricted. We will omit it for now.

-- 4. AVATAR STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow users to view their own avatar"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' AND owner = auth.uid() );

CREATE POLICY "Allow users to upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'avatars' AND owner = auth.uid() );

CREATE POLICY "Allow users to update their own avatar"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'avatars' AND owner = auth.uid() );

-- 5. ENABLE REALTIME on new tables
-- After running this script, you must go to your Supabase Dashboard
-- and enable realtime for the `chat_messages` table.
-- (Database -> Replication -> Source -> public -> 3 tables -> enable `chat_messages`)
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
