import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Modal } from '../common/Modal';
import { NewEventForm } from './NewEventForm';

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { events } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') newDate.setMonth(prev.getMonth() - 1);
      else newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const getDaysArray = () => {
    const days = Array(firstDayOfMonth).fill(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(day);
    return days;
  };

  const isToday = (day: number) => day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  const getEventsForDay = (day: number) => {
    const dayDate = new Date(currentYear, currentMonth, day);
    return events.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate.toDateString() === dayDate.toDateString();
    });
  };

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Event">
        <NewEventForm onClose={() => setIsModalOpen(false)} />
      </Modal>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-header font-bold text-slate-100 mb-2">Calendar</h1>
            <p className="text-slate-400">Your team's schedule and deadlines</p>
          </div>
          <motion.button onClick={() => setIsModalOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-neon-cyan text-midnight-950 px-6 py-3 rounded-xl font-bold hover:shadow-glow-cyan transition-all flex items-center space-x-2">
            <Plus size={20} />
            <span>New Event</span>
          </motion.button>
        </div>
        <div className="bg-midnight-800 rounded-2xl border border-neon-cyan/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigateMonth('prev')} className="p-2 hover:bg-midnight-700 rounded-lg transition-colors"><ChevronLeft size={20} className="text-slate-400" /></button>
              <h2 className="text-xl font-semibold text-slate-100">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
              <button onClick={() => navigateMonth('next')} className="p-2 hover:bg-midnight-700 rounded-lg transition-colors"><ChevronRight size={20} className="text-slate-400" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <div key={day} className="p-3 text-center text-sm font-medium text-slate-400">{day}</div>)}
            {getDaysArray().map((day, index) => {
              if (day === null) return <div key={`empty-${index}`} className="p-3 h-28" />;
              const dayEvents = getEventsForDay(day);
              return (
                <motion.div key={day} whileHover={{ scale: 1.02 }} className={`p-2 h-28 border border-midnight-700 rounded-lg cursor-pointer transition-all ${isToday(day) ? 'bg-neon-cyan/5 border-neon-cyan/30' : 'hover:bg-midnight-700/50'}`}>
                  <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'text-neon-cyan' : 'text-slate-100'}`}>{day}</div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div key={event.id} className="text-xs px-2 py-0.5 rounded text-midnight-950 truncate bg-neon-magenta" title={event.title}>{event.title}</div>
                    ))}
                    {dayEvents.length > 2 && <div className="text-xs text-slate-500 px-2">+{dayEvents.length - 2} more</div>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
