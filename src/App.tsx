import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabaseClient';
import { AuthPage } from './pages/AuthPage';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ProjectList } from './components/Projects/ProjectList';
import { TaskBoard } from './components/Tasks/TaskBoard';
import { TeamDirectory } from './components/Team/TeamDirectory';
import { Calendar } from './components/Calendar/Calendar';
import { ChatNotes } from './components/Chat/ChatNotes';
import { FilesManager } from './components/Files/FilesManager';
import { ClientView } from './components/Client/ClientView';
import { Settings } from './components/Settings/Settings';
import { DataProvider } from './contexts/DataContext';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <DataProvider>
      <Routes>
        <Route
          path="/auth"
          element={session ? <Navigate to="/" /> : <AuthPage />}
        />
        <Route
          path="/*"
          element={session ? <ProtectedRoutes /> : <Navigate to="/auth" />}
        />
      </Routes>
    </DataProvider>
  );
};

const ProtectedRoutes: React.FC = () => (
  <DashboardLayout>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/projects" element={<ProjectList />} />
      <Route path="/tasks" element={<TaskBoard />} />
      <Route path="/team" element={<TeamDirectory />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/chat" element={<ChatNotes />} />
      <Route path="/files" element={<FilesManager />} />
      <Route path="/client" element={<ClientView />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </DashboardLayout>
);

export default App;
