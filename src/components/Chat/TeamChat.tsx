import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export const TeamChat: React.FC = () => {
  const { chatMessages, addChatMessage, currentUserProfile } = useData();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    await addChatMessage({ content: newMessage });
    setNewMessage('');
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex-1 overflow-y-auto pr-4 space-y-4">
        <AnimatePresence initial={false}>
          {chatMessages.map((msg) => {
            const isCurrentUser = msg.user_id === currentUserProfile?.id;
            return (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex items-end gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isCurrentUser && (
                  msg.user?.avatar_url ? (
                    <img src={msg.user.avatar_url} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-midnight-700 flex items-center justify-center"><User size={16} /></div>
                  )
                )}
                <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isCurrentUser ? 'bg-neon-cyan/20 text-slate-100 rounded-br-none' : 'bg-midnight-700 text-slate-200 rounded-bl-none'}`}>
                  {!isCurrentUser && <p className="text-xs font-bold text-neon-blue mb-1">{msg.user?.full_name || 'User'}</p>}
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs text-slate-500 mt-1 text-right">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="mt-4 flex items-center gap-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 pl-4 pr-4 py-3 bg-midnight-900 border border-midnight-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
        />
        <motion.button type="submit" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-3 bg-neon-cyan text-midnight-950 rounded-full shadow-glow-cyan">
          <Send size={20} />
        </motion.button>
      </form>
    </div>
  );
};
