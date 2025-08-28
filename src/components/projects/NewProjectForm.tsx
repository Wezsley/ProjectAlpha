import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { TablesInsert } from '../../types/supabase';
import { Loader, Plus } from 'lucide-react';

interface NewProjectFormProps {
  onClose: () => void;
}

export const NewProjectForm: React.FC<NewProjectFormProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<TablesInsert<'projects'>['status']>('draft');
  const [loading, setLoading] = useState(false);
  const { addProject } = useData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const projectData: TablesInsert<'projects'> = {
      name,
      description: description || null,
      client: client || null,
      deadline: deadline || null,
      status,
      progress: 0,
    };
    
    const newProject = await addProject(projectData);
    setLoading(false);
    if (newProject) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Project Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full pl-4 pr-4 py-2 bg-midnight-800 border border-midnight-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full pl-4 pr-4 py-2 bg-midnight-800 border border-midnight-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="client" className="block text-sm font-medium text-slate-300 mb-2">Client</label>
          <input
            id="client"
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className="w-full pl-4 pr-4 py-2 bg-midnight-800 border border-midnight-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
          />
        </div>
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-slate-300 mb-2">Deadline</label>
          <input
            id="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full pl-4 pr-4 py-2 bg-midnight-800 border border-midnight-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className="flex items-center justify-center py-2 px-6 bg-neon-cyan text-midnight-950 font-bold rounded-lg transition-all shadow-lg shadow-neon-cyan/20 hover:shadow-neon-cyan/40 disabled:opacity-50"
        >
          {loading ? <Loader className="animate-spin" /> : <><Plus className="mr-2" size={20} /> Create Project</>}
        </motion.button>
      </div>
    </form>
  );
};
