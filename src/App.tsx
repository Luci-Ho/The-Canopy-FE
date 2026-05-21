import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Particles } from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, Navbar, MobileNav } from './components/Navigation';
import { Home } from './components/Home';
import { Collection } from './components/Collection';
import { OracleDialogue } from './components/OracleDialogue';
import { Profile } from './components/Profile';
import { Timeline } from './components/Timeline';
import { Login } from './components/Login';
import { useAuth } from './contexts/AuthContext';
import { contentApi, AudioTrack } from './services/api';
import { Leaf } from 'lucide-react';
import { audioManager } from './services/audio';

const tabRoutes = {
  home: '/',
  collection: '/vuon-ky-uc',
  oracle: '/loi-sam-truyen',
  profile: '/ho-so-linh-hon',
  timeline: '/dong-thoi-gian'
};

const routeTabs = Object.fromEntries(
  Object.entries(tabRoutes).map(([tab, path]) => [path, tab])
) as Record<string, string>;

const normalizePath = (path: string) => path.replace(/\/+$/, '') || '/';

function AppRouter() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [trackOptions, setTrackOptions] = useState<{ label: string; url: string }[]>([]);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [showTrackPanel, setShowTrackPanel] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  useEffect(() => {
    const path = normalizePath(location.pathname);
    setActiveTab(routeTabs[path] ?? 'home');
  }, [location.pathname]);

  const handleSetTab = (tab: string) => {
    setActiveTab(tab);
    navigate(tabRoutes[tab as keyof typeof tabRoutes] || '/');
  };

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

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const tracks = await contentApi.getAudioTracks();
        // Transform AudioTrack to Navigation trackOptions format
        const trackOptionsForUI = tracks.map((track) => ({
          label: track.label || track.name,
          url: track.url,
        }));
        setTrackOptions(trackOptionsForUI);
        
        const savedTrackUrl = window.localStorage.getItem('canopy-audio-track');
        if (savedTrackUrl) {
          const savedTrack = tracks.find((track) => track.url === savedTrackUrl);
          if (savedTrack) {
            setCurrentTrack(savedTrack);
          } else {
            setCurrentTrack(tracks[0]);
          }
        } else {
          setCurrentTrack(tracks[0]);
        }

        audioManager.init(false);
        const selectedUrl = savedTrackUrl || tracks[0].url;
        audioManager.selectTrack(selectedUrl);
      } catch (error) {
        console.error('Error fetching audio tracks:', error);
      }
    };

    fetchTracks();
  }, []);

  const particlesInit = useCallback(async (engine: any) => {
    try {
      await loadFull(engine);
    } catch (error) {
      console.warn('Particles initialization warning:', error);
      // Continue even if particles fail to load
    }
  }, []);

  const particleOptions = {
    fullScreen: { enable: false },
    background: { color: { value: 'transparent' } },
    particles: {
      number: { value: 80, density: { enable: true, area: 1000 } },
      color: { value: ['#f9d78f', '#f7b53c', '#ffd77d'] },
      shape: { type: 'circle' },
      opacity: { value: 0.48, random: { enable: true, minimumValue: 0.15 }, anim: { enable: true, speed: 0.7, opacityMin: 0.12, sync: false } },
      size: { value: { min: 1.2, max: 3.4 }, random: true },
      move: { enable: true, speed: 0.9, direction: 'none' as const, random: true, straight: false, outModes: { default: 'out' as const }, attract: { enable: true, rotateX: 600, rotateY: 1200 } },
      links: { enable: true, distance: 110, color: '#f7b53c', opacity: 0.18, width: 1 }
    },
    interactivity: {
      detectsOn: 'canvas' as const,
      events: {
        onHover: { enable: true, mode: ['grab', 'repulse'] },
        onClick: { enable: true, mode: 'push' },
        resize: true
      },
      modes: {
        grab: { distance: 140, links: { opacity: 0.45 } },
        repulse: { distance: 120, duration: 0.4 },
        push: { quantity: 4 }
      }
    }
  };

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  };

  const handleAudioToggle = () => {
    const nextEnabled = !isAudioEnabled;
    setIsAudioEnabled(nextEnabled);
    setShowTrackPanel(false);

    if (nextEnabled) {
      audioManager.playAudio();
    } else {
      audioManager.pauseAudio();
    }
  };

  const handleTrackSelect = (url: string, label: string) => {
    const trackName = label; // Use label as name/display
    setCurrentTrack({ id: '', name: trackName, label, url });
    setShowTrackPanel(false);
    setIsAudioEnabled(true);
    audioManager.selectTrack(url);
    audioManager.playAudio();
  };

  const toggleTrackPanel = () => {
    setShowTrackPanel((prev) => !prev);
  };

  // Loading screen while checking token
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <Leaf size={48} className="text-primary" />
        </motion.div>
        <motion.p
          className="font-headline text-primary italic text-lg"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Đang kết nối với thánh đường...
        </motion.p>
      </div>
    );
  }

  if (!isAuthenticated) {
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
        <Login />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-tertiary/20 selection:text-tertiary relative overflow-x-hidden">
      <Particles
        id="canopy-glow"
        init={particlesInit}
        options={particleOptions}
        className="pointer-events-none absolute inset-0 -z-10 opacity-85"
      />
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

      <Navbar
        setActiveTab={handleSetTab}
        theme={theme}
        toggleTheme={toggleTheme}
        isAudioEnabled={isAudioEnabled}
        onAudioToggle={handleAudioToggle}
        currentTrackLabel={currentTrack?.label || currentTrack?.name || 'Loading...'}
        trackOptions={trackOptions}
        showTrackPanel={showTrackPanel}
        toggleTrackPanel={toggleTrackPanel}
        onTrackSelect={handleTrackSelect}
      />
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleSetTab} 
        onLogout={logout}
      />

      <main className="min-h-screen pt-28 pb-32 lg:pl-80 px-6 md:px-12 max-w-screen-2xl mx-auto w-full relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Routes>
              <Route path="/" element={<Home onStartOracle={() => handleSetTab('oracle')} />} />
              <Route path="/vuon-ky-uc" element={<Collection />} />
              <Route path="/loi-sam-truyen" element={<OracleDialogue />} />
              <Route path="/ho-so-linh-hon" element={<Profile />} />
              <Route path="/dong-thoi-gian" element={<Timeline />} />
            </Routes>
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
            © 2034 Thánh đường Kỹ thuật số - Bình yên trong từng hơi thở.
          </p>
        </footer>
      </main>

      <MobileNav activeTab={activeTab} setActiveTab={handleSetTab} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
