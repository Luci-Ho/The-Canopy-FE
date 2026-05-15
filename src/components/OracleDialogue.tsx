import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, User, Leaf, Info } from 'lucide-react';
import { getOracleResponse } from '../services/gemini';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const OracleDialogue: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: 'Chào người lữ hành của tâm hồn. Ta nghe thấy tiếng bước chân khẽ khàng của bạn trong đại ngàn tri thức. Hôm nay, trái tim bạn đang tìm kiếm sự tĩnh lặng hay một lời hồi đáp từ những tán lá cổ xưa?',
      timestamp: ''
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5003';
        const response = await fetch(`${baseUrl}/api/content/oracle-suggestions`);
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching oracle suggestions:', error);
      }
    };

    fetchSuggestions();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages
      .filter((m, i) => !(i === 0 && m.role === 'model'))
      .map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

    const response = await getOracleResponse(input, history);

    const modelMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: response,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-headline italic text-primary mb-2">The Oracle Dialogue</h1>
        <p className="text-secondary opacity-70 tracking-widest uppercase text-xs">Lắng nghe hơi thở của rừng già</p>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-8 pr-4 mb-6 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={msg.role === 'model' ? { opacity: 0, y: 26, scale: 0.88, filter: 'blur(12px)' } : { opacity: 0, y: 10 }}
              animate={msg.role === 'model' ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : { opacity: 1, y: 0 }}
              transition={msg.role === 'model' ? { duration: 0.75, ease: 'easeOut' } : { duration: 0.4, ease: 'easeOut' }}
              className={cn(
                "flex items-start gap-4 max-w-[85%]",
                msg.role === 'user' ? "self-end flex-row-reverse" : "self-start"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm",
                msg.role === 'model' ? "bg-secondary-container text-secondary" : "bg-tertiary-container text-on-tertiary-container"
              )}>
                {msg.role === 'model' ? <Leaf size={18} /> : <User size={18} />}
              </div>
              <div className={cn(
                "relative p-6 rounded-2xl shadow-sm overflow-hidden",
                msg.role === 'model' 
                  ? "bg-surface-container-low rounded-tl-none border-l-4 border-primary/20 italic font-headline text-lg" 
                  : "bg-primary text-on-primary rounded-tr-none"
              )}>
                {msg.role === 'model' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6, x: -20, y: -20 }}
                    animate={{ opacity: 0.22, scale: 1.1, x: 0, y: 0 }}
                    transition={{ duration: 0.65, ease: 'easeOut' }}
                    className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-200/10 via-transparent to-transparent blur-xl"
                  />
                )}
                <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                <span className={cn(
                  "block mt-4 text-[10px] font-medium tracking-widest uppercase",
                  msg.role === 'model' ? "text-on-surface-variant" : "opacity-70 text-right"
                )}>
                  {msg.role === 'model' ? 'Linh hồn cây' : 'Bạn'} • {msg.timestamp}
                </span>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center animate-pulse">
                <Sparkles size={18} className="text-secondary" />
              </div>
              <div className="bg-surface-container-low p-4 rounded-2xl rounded-tl-none italic text-on-surface-variant">
                Linh hồn cây đang lắng nghe lời thì thầm của gió...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {suggestions.map((s) => (
            <button 
              key={s}
              onClick={() => setInput(s)}
              className="bg-surface-container-high hover:bg-secondary-container text-on-surface-variant hover:text-secondary px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 border border-outline-variant/10"
            >
              <Sparkles size={14} />
              {s}
            </button>
          ))}
        </div>

        <div className="relative">
          <div className="bg-surface-container-lowest/90 backdrop-blur-xl p-3 rounded-full shadow-2xl shadow-primary/10 flex items-center gap-3 border border-outline-variant/20">
            <button className="w-12 h-12 rounded-full flex items-center justify-center text-primary hover:bg-primary/10 transition-colors">
              <Info size={20} />
            </button>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/50" 
              placeholder="Gửi gắm tâm tình của bạn tại đây..." 
              type="text"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-primary text-on-primary w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
