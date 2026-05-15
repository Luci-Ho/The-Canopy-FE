import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Leaf, 
  BookOpen, 
  Sparkles, 
  History, 
  Cog, 
  Sun, 
  SunMoon, 
  PlusCircle,
  User,
  LogOut,
  Music2,
  Play,
  Pause
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

const AnimateIcon: React.FC<{ animateOnHover?: boolean; className?: string; children: React.ReactNode }> = ({ animateOnHover = false, className, children }) => (
  <motion.span
    className={className}
    whileHover={animateOnHover ? { scale: 1.15, rotate: [0, 6, -4, 0] } : undefined}
    whileTap={animateOnHover ? { scale: 0.93 } : undefined}
    transition={{ duration: 0.25, ease: 'easeOut' }}
  >
    {children}
  </motion.span>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const { user } = useAuth();
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5003';
  const resolveAvatarUrl = (url: string) => {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return `${baseUrl}${url}`;
    return `${baseUrl}/${url}`;
  };

  const menuItems = [
    { id: 'home', label: 'Lá tâm tình', icon: Leaf },
    { id: 'collection', label: 'Vườn ký ức', icon: BookOpen },
    { id: 'oracle', label: 'Lời sấm truyền', icon: Sparkles },
    { id: 'profile', label: 'Hồ sơ linh hồn', icon: User },
    { id: 'timeline', label: 'Dòng thời gian', icon: History },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen z-40 flex-col p-6 w-80 bg-surface rounded-r-4xl shadow-2xl shadow-primary/10 pt-24">
      <div className="flex items-center gap-4 mb-10 px-4">
        <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border border-primary/10">
          {user?.avatarUrl ? (
            <img
              src={resolveAvatarUrl(user.avatarUrl)}
              alt="Avatar" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <User size={24} className="text-primary" />
          )}
        </div>
        <div>
          <p className="font-headline font-bold text-lg text-primary">{user?.username || 'Linh hồn cây'}</p>
          <p className="text-xs text-secondary opacity-70 truncate max-w-40">{user?.email || 'Người dẫn dắt linh hồn'}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2 grow">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-300 text-sm font-medium",
              activeTab === item.id 
                ? "bg-primary/10 text-primary" 
                : "text-secondary opacity-70 hover:bg-tertiary/5 hover:text-tertiary hover:opacity-100"
            )}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <button 
          onClick={() => setActiveTab('oracle')}
          className="w-full bg-primary text-on-primary rounded-full py-4 px-6 flex items-center justify-center gap-2 font-medium hover:bg-primary-container transition-all shadow-lg shadow-primary/20"
        >
          <PlusCircle size={20} />
          <span>Gieo Quẻ Mới</span>
        </button>
        
        {onLogout && (
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-xs text-on-surface-variant opacity-50 hover:opacity-100 transition-opacity py-2"
          >
            <LogOut size={14} />
            Đăng xuất khỏi thánh đường
          </button>
        )}
      </div>
    </aside>
  );
};

interface NavbarProps {
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isAudioEnabled: boolean;
  onAudioToggle: () => void;
  currentTrackLabel: string;
  trackOptions: { label: string; url: string }[];
  showTrackPanel: boolean;
  toggleTrackPanel: () => void;
  onTrackSelect: (url: string, label: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  setActiveTab,
  theme,
  toggleTheme,
  isAudioEnabled,
  onAudioToggle,
  currentTrackLabel,
  trackOptions,
  showTrackPanel,
  toggleTrackPanel,
  onTrackSelect,
}) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-background/80 backdrop-blur-md shadow-sm shadow-primary/5">
      <div 
        className="text-2xl font-headline font-bold text-primary cursor-pointer"
        onClick={() => setActiveTab('home')}
      >
        The Canopy
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        {['Khởi đầu', 'Về Oracle Tree', 'Tri thức cổ'].map((link) => (
          <a 
            key={link}
            href="#" 
            className="text-secondary opacity-80 text-sm tracking-wide hover:text-tertiary transition-colors duration-300"
          >
            {link}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-4 relative">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAudioToggle}
            className="rounded-full bg-surface-container-high p-2 text-primary hover:text-tertiary transition-colors shadow-sm shadow-primary/10"
          >
            <AnimateIcon animateOnHover>
              {isAudioEnabled ? <Pause size={18} /> : <Play size={18} />}
            </AnimateIcon>
          </button>
          <button
            type="button"
            onClick={toggleTrackPanel}
            className="rounded-full border border-primary/10 bg-surface-container-high px-3 py-2 text-xs font-medium text-secondary hover:bg-surface-container hover:text-primary transition-all"
          >
            <span className="inline-flex items-center gap-2">
              <Music2 size={16} />
              {currentTrackLabel}
            </span>
          </button>
        </div>

        {showTrackPanel && (
          <div className="absolute right-0 top-14 w-80 rounded-3xl border border-primary/10 bg-background/95 shadow-2xl shadow-primary/15 p-4 backdrop-blur-xl z-50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-secondary">Âm nhạc</p>
                <p className="text-sm font-semibold text-on-background">Chọn bản nhạc</p>
              </div>
              <button
                type="button"
                onClick={toggleTrackPanel}
                className="text-secondary text-sm hover:text-primary transition-colors"
              >
                Đóng
              </button>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2">
              {trackOptions.map((track) => (
                <button
                  key={track.label}
                  type="button"
                  onClick={() => onTrackSelect(track.url, track.label)}
                  className="w-full rounded-full border border-primary/10 bg-surface-container-high px-4 py-3 text-left text-sm text-on-surface transition-all hover:bg-primary/5"
                >
                  {track.label}
                </button>
              ))}
            </div>
            <p className="mt-4 text-[11px] text-secondary opacity-80">
              Nhấn vào tên bài là chơi ngay, nút dừng giữ lại vị trí cũ.
            </p>
          </div>
        )}

        <motion.button
          type="button"
          onClick={toggleTheme}
          whileTap={{ scale: 0.94 }}
          className="rounded-full p-2 text-sm font-semibold text-on-surface transition-all hover:-translate-y-0.5"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="inline-flex"
            >
              <AnimateIcon animateOnHover>
                {theme === 'light' ? <Sun size={20} /> : <SunMoon size={20} />}
              </AnimateIcon>
            </motion.div>
          </AnimatePresence>
        </motion.button>
        <button className="p-2 text-primary hover:text-tertiary transition-colors">
          <AnimateIcon animateOnHover>
            <Cog size={20} />
          </AnimateIcon>
        </button>
        <button className="p-2 text-primary hover:text-tertiary transition-colors">
          <AnimateIcon animateOnHover>
            <Leaf size={20} />
          </AnimateIcon>
        </button>
      </div>
    </nav>
  );
};

export const MobileNav: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
  const items = [
    { id: 'home', label: 'Oracle', icon: Leaf },
    { id: 'collection', label: 'Ký ức', icon: BookOpen },
    { id: 'oracle', label: 'Gieo', icon: PlusCircle, isCenter: true },
    { id: 'timeline', label: 'Lời sấm', icon: Sparkles },
    { id: 'profile', label: 'Tôi', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full h-16 bg-white/90 backdrop-blur-lg flex items-center justify-around z-50 px-4 border-t border-primary/5">
      {items.map((item) => (
        item.isCenter ? (
          <div key={item.id} className="relative -top-6">
            <button 
              onClick={() => setActiveTab(item.id)}
              className="w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center"
            >
              <item.icon size={24} />
            </button>
          </div>
        ) : (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              activeTab === item.id ? "text-primary" : "text-secondary opacity-60"
            )}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        )
      ))}
    </nav>
  );
};
