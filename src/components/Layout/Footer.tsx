import React from 'react';

export const Footer: React.FC = () => {
  const teamMembers = [
    'Wesley Belmonte',
    'Glyza Crismundo',
    'Abegail Delicano',
    'Bryan Padiz',
    'Mae Ann Olitres'
  ];

  return (
    <footer className="bg-midnight-900 border-t border-neon-cyan/10 px-6 py-4 text-center text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-semibold">
          Project Alpha by Group 7 "Wezs Company" &copy; {new Date().getFullYear()}
        </p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
          {teamMembers.map(member => (
            <span key={member}>{member}</span>
          ))}
        </div>
      </div>
    </footer>
  );
};
