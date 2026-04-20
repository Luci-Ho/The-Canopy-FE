import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar, Navbar, MobileNav } from './components/Navigation';
import { Home } from './components/Home';
import { Collection } from './components/Collection';
import { OracleDialogue } from './components/OracleDialogue';
import { Login } from './components/Login';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // Firefly background effect
  const [fireflies, setFireflies] = useState<{ id: number; top: string; left: string; delay: string }[]>([]);

  useEffect(() => {
    const newFireflies = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`
    }));
    setFireflies(newFireflies);
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="relative overflow-hidden">
        {fireflies.map(f => (
          <motion.div 
            key={f.id}
            className="firefly"
            style={{ top: f.top, left: f.left }}
            animate={{ 
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1],
              x: [0, 20, -20, 0],
              y: [0, -20, 20, 0]
            }}
            transition={{ 
              duration: 5 + Math.random() * 5, 
              repeat: Infinity,
              delay: parseFloat(f.delay)
            }}
          />
        ))}
        <Login onLogin={() => setIsLoggedIn(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-tertiary/20 selection:text-tertiary relative overflow-x-hidden">
      {/* Background Fireflies */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {fireflies.map(f => (
          <motion.div 
            key={f.id}
            className="firefly"
            style={{ top: f.top, left: f.left }}
            animate={{ 
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1],
              x: [0, 30, -30, 0],
              y: [0, -30, 30, 0]
            }}
            transition={{ 
              duration: 8 + Math.random() * 8, 
              repeat: Infinity,
              delay: parseFloat(f.delay)
            }}
          />
        ))}
      </div>

      <Navbar setActiveTab={setActiveTab} />
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={() => setIsLoggedIn(false)}
      />

      <main className="min-h-screen pt-28 pb-32 lg:pl-80 px-6 md:px-12 max-w-[1600px] mx-auto w-full relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {activeTab === 'home' && <Home onStartOracle={() => setActiveTab('oracle')} />}
            {activeTab === 'collection' && <Collection />}
            {activeTab === 'oracle' && <OracleDialogue />}
            {activeTab === 'timeline' && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <h2 className="font-headline text-4xl text-primary mb-4">Dòng thời gian</h2>
                <p className="text-secondary opacity-60">Tính năng này đang được gieo mầm. Hãy quay lại sau nhé.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <footer className="w-full flex flex-col items-center gap-4 mt-20 py-12 border-t border-primary/5">
          <div className="font-headline italic text-primary text-xl">The Canopy</div>
          <div className="flex flex-wrap justify-center gap-8">
            {['Điều khoản tâm linh', 'Chính sách bảo mật', 'Liên kết rễ cây'].map(link => (
              <a 
                key={link}
                href="#" 
                className="text-xs uppercase tracking-widest text-secondary opacity-60 hover:opacity-100 hover:text-primary transition-all"
              >
                {link}
              </a>
            ))}
          </div>
          <p className="text-[10px] uppercase tracking-widest text-secondary opacity-40">
            © 2024 Thánh đường Kỹ thuật số - Bình yên trong từng hơi thở.
          </p>
        </footer>
      </main>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
