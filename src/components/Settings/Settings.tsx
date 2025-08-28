import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, Palette, Globe, Save, Upload, Loader, CheckCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { TablesUpdate } from '../../types/supabase';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { currentUserProfile, updateProfile, uploadAvatar } = useData();
  
  const [fullName, setFullName] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUserProfile) {
      setFullName(currentUserProfile.full_name || '');
      setWebsite(currentUserProfile.website || '');
      setAvatarUrl(currentUserProfile.avatar_url || null);
    }
  }, [currentUserProfile]);

  const handleSave = async () => {
    setLoading(true);
    setSuccessMessage(null);
    const updates: TablesUpdate<'profiles'> = {
      full_name: fullName,
      website,
      updated_at: new Date().toISOString(),
    };
    await updateProfile(updates);
    setLoading(false);
    setSuccessMessage("Profile updated successfully!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const publicUrl = await uploadAvatar(file);
    if (publicUrl) {
      await updateProfile({ avatar_url: publicUrl });
      setAvatarUrl(publicUrl);
    }
    setUploading(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'general', label: 'General', icon: Globe }
  ];

  const renderContent = () => {
    if (activeTab === 'profile') {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Profile Picture</h3>
            <div className="flex items-center gap-6">
              <div className="relative">
                {uploading ? (
                  <div className="w-24 h-24 rounded-full bg-midnight-700 flex items-center justify-center"><Loader className="animate-spin text-neon-cyan" /></div>
                ) : avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-neon-cyan/20" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-midnight-700 flex items-center justify-center"><User size={40} className="text-slate-400" /></div>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
              <motion.button onClick={() => fileInputRef.current?.click()} whileHover={{ scale: 1.05 }} className="bg-midnight-700 hover:bg-neon-cyan/20 text-slate-200 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-all">
                <Upload size={16} /> Upload
              </motion.button>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full pl-4 pr-4 py-2 bg-midnight-700 border border-midnight-950 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-cyan" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Website</label>
              <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full pl-4 pr-4 py-2 bg-midnight-700 border border-midnight-950 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-cyan" />
            </div>
          </div>
        </motion.div>
      );
    }
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-300">Coming Soon</h2>
          <p className="text-slate-500 mt-2">The '{activeTab}' settings are under construction.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-header font-bold text-slate-100 mb-2">Settings</h1>
          <p className="text-slate-400">Manage your account and preferences</p>
        </div>
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {successMessage && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex items-center gap-2 text-neon-green">
                <CheckCircle size={20} />
                <span className="text-sm font-medium">{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button onClick={handleSave} disabled={loading} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-neon-cyan text-midnight-950 px-6 py-3 rounded-xl font-bold hover:shadow-glow-cyan transition-all flex items-center space-x-2 disabled:opacity-50">
            {loading ? <Loader className="animate-spin" /> : <><Save size={20} /><span>Save Changes</span></>}
          </motion.button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 bg-midnight-800 rounded-xl border border-neon-cyan/10 p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all text-left ${activeTab === tab.id ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-slate-400 hover:bg-midnight-700'}`}>
                <tab.icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            ))}
          </nav>
        </div>
        <div className="flex-1 bg-midnight-800 rounded-xl border border-neon-cyan/10 p-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
