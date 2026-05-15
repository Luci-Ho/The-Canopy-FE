import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, ArrowRight, BookOpen, Mail, KeyRound, UserPlus, LogIn, User } from 'lucide-react';
import { authApi, ApiError } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

type Step = 'login' | 'register';

export const Login: React.FC = () => {
  const { setToken } = useAuth();

  const [step, setStep] = useState<Step>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      await authApi.register(email, password, username);
      setSuccess('Đăng ký thành công! Đang đăng nhập...');
      // Auto-login after register
      const loginRes = await authApi.login(email, password);
      if (loginRes.token) {
        setToken(loginRes.token);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      if (res.token) {
        setToken(res.token);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const switchToRegister = () => {
    clearMessages();
    setStep('register');
  };

  const switchToLogin = () => {
    clearMessages();
    setStep('login');
  };

  const isLogin = step === 'login';
  const config = isLogin
    ? { title: 'Kết nối tâm hồn', subtitle: 'Nhập mật danh để bước vào thánh đường', icon: LogIn, buttonText: 'Bước qua cánh cổng', onSubmit: handleLogin }
    : { title: 'Gieo hạt giống mới', subtitle: 'Đặt mật danh để bắt đầu hành trình', icon: UserPlus, buttonText: 'Gieo hạt giống', onSubmit: handleRegister };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-12 bg-background">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        {/* Left Column */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
          <header className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Leaf size={32} />
              <h1 className="text-3xl font-headline font-bold tracking-tight">The Canopy</h1>
            </div>
            <div className="space-y-2">
              <h2 className="text-5xl font-headline italic text-primary leading-tight">Cổng vào<br/>Thánh đường</h2>
              <p className="text-on-surface-variant text-lg max-w-md">Lắng nghe hơi thở của rừng già, nơi mỗi bước chân là một hành trình tìm lại sự tĩnh lặng trong tâm hồn.</p>
            </div>
          </header>
          
          <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] shadow-2xl shadow-primary/10 group">
            <img 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop" 
              alt="Forest Gate"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex flex-col justify-end p-8 text-white">
              <p className="font-headline italic text-xl">"Rừng không chỉ là cây, rừng là nơi trú ngụ của những linh hồn đang tìm đường về nhà."</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 shadow-sm border border-outline-variant/10">
            <div className="max-w-md mx-auto space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* Header */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                      <config.icon size={24} />
                    </div>
                    <h3 className="text-2xl font-headline text-on-surface">{config.title}</h3>
                    <p className="text-on-surface-variant text-sm mt-2">{config.subtitle}</p>
                  </div>

                  {/* Messages */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-tertiary/10 border border-tertiary/20 text-tertiary px-4 py-3 rounded-2xl text-sm text-center"
                    >
                      {error}
                    </motion.div>
                  )}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-primary/10 border border-primary/20 text-primary px-4 py-3 rounded-2xl text-sm text-center"
                    >
                      {success}
                    </motion.div>
                  )}

                  {/* Form */}
                  <form className="space-y-6" onSubmit={config.onSubmit}>
                    {!isLogin && (
                      <div className="space-y-2">
                        <label className="block text-xs font-medium uppercase tracking-widest text-on-surface-variant px-1">
                          <User size={12} className="inline mr-1 -mt-0.5" />
                          Chân Danh
                        </label>
                        <input 
                          className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface outline-none transition-shadow" 
                          placeholder="Hiện thân của bạn dưới tán đại thụ" 
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          autoComplete="username"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-widest text-on-surface-variant px-1">
                        <Mail size={12} className="inline mr-1 -mt-0.5" />
                        Mật danh (Email)
                      </label>
                      <input 
                        className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface outline-none transition-shadow" 
                        placeholder="spirit@thecanopy.vn" 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-widest text-on-surface-variant px-1">
                        <KeyRound size={12} className="inline mr-1 -mt-0.5" />
                        Mật mã
                      </label>
                      <input 
                        className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface outline-none transition-shadow" 
                        placeholder="••••••••" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        autoComplete={isLogin ? 'current-password' : 'new-password'}
                      />
                    </div>

                    <button 
                      className="w-full bg-primary text-on-primary font-medium py-4 rounded-full shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-95 flex justify-center items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed" 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                      ) : (
                        <>
                          {config.buttonText}
                          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                  
                  {/* Footer links */}
                  <div className="flex items-center justify-between text-sm pt-4">
                    {isLogin ? (
                      <>
                        <span className="text-on-surface-variant text-xs">Tìm kiếm sự sự khởi đầu?</span>
                        <button 
                          onClick={switchToRegister} 
                          className="text-primary font-semibold hover:underline"
                          type="button"
                        >
                          Gieo hạt giống mới
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-on-surface-variant text-xs">Đã có mật danh?</span>
                        <button 
                          onClick={switchToLogin} 
                          className="text-primary font-semibold hover:underline"
                          type="button"
                        >
                          Đi tiếp
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bento Items */}
          <div className="bg-surface-container-low rounded-[2rem] p-6 flex flex-col justify-between hover:bg-surface-container transition-colors cursor-pointer group">
            <div className="flex justify-between items-start">
              <Leaf className="text-tertiary" />
              <span className="text-xs font-bold text-on-surface-variant opacity-60">01</span>
            </div>
            <div>
              <h4 className="font-headline text-lg text-on-surface">Lá tâm tình</h4>
              <p className="text-xs text-on-surface-variant mt-1">12 thông điệp chưa đọc</p>
            </div>
          </div>
          
          <div className="bg-secondary-container/30 rounded-[2rem] p-6 flex flex-col justify-between hover:bg-secondary-container/50 transition-colors cursor-pointer">
            <div className="flex justify-between items-start">
              <BookOpen className="text-secondary" />
              <span className="text-xs font-bold text-on-surface-variant opacity-60">02</span>
            </div>
            <div>
              <h4 className="font-headline text-lg text-on-surface">Vườn ký ức</h4>
              <p className="text-xs text-on-surface-variant mt-1">45 khoảnh khắc bình yên</p>
            </div>
          </div>

          <div className="md:col-span-2 bg-surface-container-high rounded-[2rem] p-8 flex items-center gap-6 group cursor-pointer hover:bg-surface-container-highest transition-all">
            <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-4 border-white shadow-md">
              <img 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" 
                alt="User"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-grow">
              <h4 className="font-headline text-xl text-primary">Tiếp tục hành trình, Linh hồn Cây?</h4>
              <p className="text-sm text-on-surface-variant mt-1">Bạn đã dành 156 giờ thiền định cùng The Canopy.</p>
            </div>
            <ArrowRight className="text-primary group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
