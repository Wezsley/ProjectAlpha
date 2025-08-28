import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-midnight-950 flex text-slate-200 font-sans transition-colors duration-300">
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className={`${isMobileMenuOpen ? 'fixed' : 'hidden'} lg:relative lg:block inset-y-0 left-0 z-50 lg:z-0`}>
        <Sidebar
          isExpanded={sidebarExpanded}
          onLinkClick={() => setIsMobileMenuOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onSidebarToggle={() => setSidebarExpanded(!sidebarExpanded)}
          sidebarExpanded={sidebarExpanded}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};
