import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { TablesInsert } from '../../types/supabase';
import { Loader, Plus } from 'lucide-react';

interface NewEventFormProps {
  onClose: () => void;
}

export const NewEventForm: React.FC<NewEventFormProps> = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const { addEvent } = useData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !startTime || !endDate || !endTime) {
      alert("Please fill all date and time fields.");
      return;
    }
    setLoading(true);

    const eventData: TablesInsert<'events'> = {
      title,
      description: description || null,
      start_time: new Date(`${startDate}T${startTime}`).toISOString(),
      end_time: new Date(`${endDate}T${endTime}`).toISOString(),
    };

    const newEvent = await addEvent(eventData);
    setLoading(false);
    if (newEvent) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">Event Title</label>
        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full pl-4 pr-4 py-2 bg-midnight-800 border border-midnight-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-cyan" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full pl-4 pr-4 py-2 bg-midnight-800 border border-midnight-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-cyan" />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Start</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="w-full mb-2 p-2 bg-midnight-800 border border-midnight-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-cyan" />
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="w-full p-2 bg-midnight-800 border border-midnight-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-cyan" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">End</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className="w-full mb-2 p-2 bg-midnight-800 border border-midnight-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-cyan" />
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="w-full p-2 bg-midnight-800 border border-midnight-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-cyan" />
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center justify-center py-2 px-6 bg-neon-cyan text-midnight-950 font-bold rounded-lg transition-all shadow-lg shadow-neon-cyan/20 hover:shadow-neon-cyan/40 disabled:opacity-50">
          {loading ? <Loader className="animate-spin" /> : <><Plus className="mr-2" size={20} /> Create Event</>}
        </motion.button>
      </div>
    </form>
  );
};
