import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Loader } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Modal } from '../common/Modal';

const NewNoteForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { addNote } = useData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const newNote = await addNote({ title, content });
    setLoading(false);
    if (newNote) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Note Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2 bg-midnight-800 border border-midnight-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-cyan" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Content</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5} className="w-full p-2 bg-midnight-800 border border-midnight-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-cyan" />
      </div>
      <div className="flex justify-end pt-4">
        <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.05 }} className="flex items-center justify-center py-2 px-6 bg-neon-cyan text-midnight-950 font-bold rounded-lg disabled:opacity-50">
          {loading ? <Loader className="animate-spin" /> : <><Plus className="mr-2" size={20} /> Create Note</>}
        </motion.button>
      </div>
    </form>
  );
};

export const ProjectNotes: React.FC = () => {
  const { notes, deleteNote } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Note">
        <NewNoteForm onClose={() => setIsModalOpen(false)} />
      </Modal>
      <div className="h-full flex flex-col p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto flex-1 pr-4">
          <motion.div
            layout
            onClick={() => setIsModalOpen(true)}
            whileHover={{ y: -4, boxShadow: '0 0 15px rgba(0, 229, 255, 0.2)' }}
            className="bg-midnight-900 rounded-2xl transition-all duration-300 cursor-pointer border-2 border-dashed border-neon-cyan/20 hover:border-neon-cyan/50 flex items-center justify-center min-h-[200px]"
          >
            <div className="text-center text-neon-cyan">
              <Plus size={40} className="mx-auto mb-2" />
              <span className="font-semibold">New Note</span>
            </div>
          </motion.div>
          <AnimatePresence>
            {notes.map((note) => (
              <motion.div
                layout
                key={note.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-midnight-900 rounded-2xl p-6 flex flex-col justify-between border border-neon-cyan/10"
              >
                <div>
                  <h3 className="font-bold text-slate-100 mb-2">{note.title}</h3>
                  <p className="text-sm text-slate-400 whitespace-pre-wrap">{note.content}</p>
                </div>
                <div className="flex justify-end items-center mt-4">
                  <motion.button onClick={() => deleteNote(note.id)} whileHover={{ scale: 1.1, color: '#FF8C00' }} className="text-slate-500">
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};
