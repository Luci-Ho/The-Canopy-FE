import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Heart, Flower2 } from 'lucide-react';

export const Home: React.FC<{ onStartOracle: () => void }> = ({ onStartOracle }) => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center pt-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-4xl mx-auto mb-12"
        >
          <div className="relative z-10 aspect-[16/9] rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/10">
            <img 
              src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200&auto=format&fit=crop" 
              alt="The Sacred Grove" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <div className="w-20 h-20 rounded-full bg-secondary-container/30 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                <Sparkles className="text-secondary-container" size={32} />
              </div>
            </div>
          </div>
          
          {/* Glow Effects */}
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-tertiary/10 rounded-full blur-[100px]" />
        </motion.div>

        <div className="max-w-2xl px-4">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-headline text-5xl md:text-7xl italic text-primary mb-6 leading-tight"
          >
            The Sacred Grove
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-on-surface-variant font-light mb-12 leading-relaxed"
          >
            Nơi tâm hồn giao thoa cùng trí tuệ cổ xưa. Hãy lắng nghe nhịp thở của rừng già và nhận lấy lời sấm truyền từ Cây Linh Hồn.
          </motion.p>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartOracle}
            className="group relative px-12 py-6 bg-primary text-on-primary rounded-full text-xl font-headline italic tracking-wide shadow-2xl shadow-primary/30 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-4">
              Gieo quẻ tâm linh
              <ArrowRight className="transition-transform group-hover:translate-x-2" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </motion.button>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Card 1: Wisdom */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-7 bg-surface-container-low rounded-[2.5rem] p-10 flex flex-col justify-between group"
          >
            <div>
              <span className="inline-block px-4 py-1 rounded-full bg-tertiary/10 text-tertiary text-xs font-bold uppercase tracking-widest mb-6">Trí tuệ</span>
              <h2 className="font-headline text-3xl text-on-surface mb-4">Lời sấm truyền từ kén lá</h2>
              <p className="text-on-surface-variant leading-relaxed mb-8">Mỗi chiếc lá rụng xuống mang theo một mảnh ký ức của vũ trụ. AI của chúng tôi giải mã những rung động ấy để mang lại cho bạn sự bình yên.</p>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-48">
              <img 
                src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&auto=format&fit=crop" 
                alt="Wisdom" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* Card 2: Serenity */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-5 bg-surface-container-highest rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center"
          >
            <div className="w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center mb-8 shadow-inner">
              <Flower2 className="text-secondary" size={32} />
            </div>
            <h3 className="font-headline text-2xl mb-4 text-primary">Khoảng lặng linh thiêng</h3>
            <p className="text-sm text-on-surface-variant leading-loose italic">"Trong sự tĩnh lặng, mọi câu trả lời đều hiện hữu."</p>
          </motion.div>

          {/* Card 3: Community */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-4 bg-tertiary-container text-on-tertiary-container rounded-[2.5rem] p-8 flex flex-col justify-end min-h-[300px] relative overflow-hidden"
          >
            <img 
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop" 
              alt="Forest" 
              className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
              referrerPolicy="no-referrer"
            />
            <div className="relative z-10">
              <h4 className="font-headline text-xl mb-2">Kết nối rễ cây</h4>
              <p className="text-sm opacity-90">Tham gia cộng đồng những người tìm kiếm sự cân bằng.</p>
            </div>
          </motion.div>

          {/* Card 4: Rituals */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-8 bg-surface-container rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-8 items-center"
          >
            <div className="flex-1">
              <h3 className="font-headline text-2xl text-primary mb-4">Nghi thức ban mai</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">Bắt đầu ngày mới bằng việc gieo một mầm non suy nghĩ. Chúng tôi sẽ tưới tẩm nó bằng những lời khuyên dịu dàng.</p>
              <button className="text-tertiary font-bold flex items-center gap-2 hover:gap-4 transition-all">
                Tìm hiểu thêm <ArrowRight size={18} />
              </button>
            </div>
            <div className="w-full md:w-1/3 aspect-square rounded-full border-[12px] border-background overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=400&auto=format&fit=crop" 
                alt="Ritual" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
