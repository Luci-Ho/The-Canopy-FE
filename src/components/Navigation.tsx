import React from 'react';
import { motion } from 'motion/react';
import { 
  Leaf, 
  BookOpen, 
  Sparkles, 
  History, 
  Settings, 
  PlusCircle,
  User,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'home', label: 'Lá tâm tình', icon: Leaf },
    { id: 'collection', label: 'Vườn ký ức', icon: BookOpen },
    { id: 'oracle', label: 'Lời sấm truyền', icon: Sparkles },
    { id: 'timeline', label: 'Dòng thời gian', icon: History },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen z-40 flex-col p-6 w-80 bg-surface rounded-r-[2rem] shadow-2xl shadow-primary/10 pt-24">
      <div className="flex items-center gap-4 mb-10 px-4">
        <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border border-primary/10">
          <img 
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" 
            alt="Avatar" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <p className="font-headline font-bold text-lg text-primary">Linh hồn cây</p>
          <p className="text-xs text-secondary opacity-70">Người dẫn dắt linh hồn</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
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

export const Navbar: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
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

      <div className="flex items-center gap-4 text-primary">
        <button className="p-2 hover:text-tertiary transition-colors">
          <Settings size={20} />
        </button>
        <button className="p-2 hover:text-tertiary transition-colors">
          <Leaf size={20} />
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
