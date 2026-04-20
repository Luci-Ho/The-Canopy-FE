import React from 'react';
import { motion } from 'motion/react';
import { Leaf, ArrowRight, BookOpen, History } from 'lucide-react';

export const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
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
              <div className="text-center">
                <h3 className="text-2xl font-headline text-on-surface">Kết nối tâm hồn</h3>
                <p className="text-on-surface-variant text-sm mt-2">Vui lòng nhập định danh để tiếp tục hành trình</p>
              </div>
              
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                <div className="space-y-2">
                  <label className="block text-xs font-medium uppercase tracking-widest text-on-surface-variant px-1">Định danh (Email)</label>
                  <input 
                    className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface outline-none" 
                    placeholder="spirit@thecanopy.vn" 
                    type="email" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium uppercase tracking-widest text-on-surface-variant px-1">Mật mã cổ</label>
                  <input 
                    className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface outline-none" 
                    placeholder="••••••••" 
                    type="password" 
                    required
                  />
                </div>
                <button 
                  className="w-full bg-primary text-on-primary font-medium py-4 rounded-full shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-95 flex justify-center items-center gap-2 group" 
                  type="submit"
                >
                  Bước qua cánh cổng
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
              
              <div className="flex items-center justify-between text-sm pt-4">
                <a className="text-on-surface-variant hover:text-tertiary transition-colors" href="#">Quên mật mã?</a>
                <a className="text-primary font-semibold hover:underline" href="#">Gieo hạt giống mới</a>
              </div>
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
