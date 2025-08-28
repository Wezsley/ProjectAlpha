import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { TablesInsert } from '../../types/supabase';
import { Loader, Plus } from 'lucide-react';

interface NewTaskFormProps {
  onClose: () => void;
  initialStatus?: TablesInsert<'tasks'>['status'];
}

export const NewTaskForm: React.FC<NewTaskFormProps> = ({ onClose, initialStatus = 'todo' }) => {
  const { projects, profiles, addTask } = useData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState<number | null>(null);
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TablesInsert<'tasks'>['priority']>('medium');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const taskData: TablesInsert<'tasks'> = {
      title,
      description: description || null,
      project_id: projectId,
      assignee_id: assigneeId,
      due_date: dueDate || null,
      priority,
      status: initialStatus,
    };

    const newTask = await addTask(taskData);
    setLoading(false);
    if (newTask) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">Task Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          <label htmlFor="project" className="block text-sm font-medium text-slate-300 mb-2">Project</label>
          <select
            id="project"
            value={projectId || ''}
            onChange={(e) => setProjectId(Number(e.target.value) || null)}
            className="w-full pl-4 pr-4 py-2 bg-midnight-800 border border-midnight-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
          >
            <option value="">Select a project</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="assignee" className="block text-sm font-medium text-slate-300 mb-2">Assignee</label>
          <select
            id="assignee"
            value={assigneeId || ''}
            onChange={(e) => setAssigneeId(e.target.value || null)}
            className="w-full pl-4 pr-4 py-2 bg-midnight-800 border border-midnight-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
          >
            <option value="">Unassigned</option>
            {profiles.map(p => <option key={p.id} value={p.id}>{p.full_name || p.username}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="due-date" className="block text-sm font-medium text-slate-300 mb-2">Due Date</label>
          <input
            id="due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full pl-4 pr-4 py-2 bg-midnight-800 border border-midnight-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
          />
        </div>
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TablesInsert<'tasks'>['priority'])}
            className="w-full pl-4 pr-4 py-2 bg-midnight-800 border border-midnight-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
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
          {loading ? <Loader className="animate-spin" /> : <><Plus className="mr-2" size={20} /> Add Task</>}
        </motion.button>
      </div>
    </form>
  );
};
