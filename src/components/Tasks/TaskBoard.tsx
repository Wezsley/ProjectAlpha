import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Task } from '../../types';
import { Modal } from '../common/Modal';
import { NewTaskForm } from './NewTaskForm';

const columns: { id: Task['status']; title: string; color: string; }[] = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-400' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-neon-blue' },
  { id: 'review', title: 'Review', color: 'bg-neon-magenta' },
  { id: 'completed', title: 'Completed', color: 'bg-neon-green' },
];

export const TaskBoard: React.FC = () => {
  const { filteredTasks, loading, updateTaskStatus } = useData();
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<Task['status']>('todo');

  const openModal = (status: Task['status']) => {
    setModalStatus(status);
    setIsModalOpen(true);
  };

  const getPriorityStyle = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-neon-orange';
      case 'medium': return 'border-l-4 border-yellow-400';
      case 'low': return 'border-l-4 border-neon-blue';
      default: return 'border-l-4 border-midnight-700';
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: number) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, newStatus: Task['status']) => {
    e.preventDefault();
    if (draggedTaskId === null) return;
    
    const task = filteredTasks.find(t => t.id === draggedTaskId);
    if (task && task.status !== newStatus) {
      await updateTaskStatus(draggedTaskId, newStatus);
    }
    setDraggedTaskId(null);
  };

  if (loading) {
    return <div className="text-center p-10">Loading Tasks...</div>;
  }

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Task">
        <NewTaskForm onClose={() => setIsModalOpen(false)} initialStatus={modalStatus} />
      </Modal>
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl lg:text-header font-bold text-slate-100">Task Board</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 min-h-0">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter(task => task.status === column.id);
            return (
              <div
                key={column.id}
                className="bg-midnight-800 rounded-xl border border-neon-cyan/10 p-4 flex flex-col"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${column.color}`} />
                    <h2 className="font-semibold text-slate-100 text-sm">{column.title}</h2>
                    <span className="bg-midnight-700 text-slate-400 text-xs px-2 py-1 rounded-full">{columnTasks.length}</span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {columnTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className={`bg-midnight-900 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:bg-midnight-700 transition-all ${getPriorityStyle(task.priority)}`}
                    >
                      <h3 className="font-medium text-slate-100 text-sm leading-tight mb-2">{task.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs text-slate-400">
                          <Calendar size={12} />
                          <span>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        {task.assignee?.avatar_url && (
                          <img
                            src={task.assignee.avatar_url}
                            alt={task.assignee.full_name || 'Assignee'}
                            className="w-6 h-6 rounded-full border-2 border-midnight-700"
                            title={task.assignee.full_name || 'Assignee'}
                          />
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => openModal(column.id)}
                    className="w-full border border-dashed border-neon-cyan/20 rounded-lg p-3 text-slate-400 hover:border-neon-cyan/50 hover:text-neon-cyan transition-all flex items-center justify-center space-x-2 text-sm"
                  >
                    <Plus size={14} />
                    <span>Add Task</span>
                  </motion.button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
