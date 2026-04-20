import React from 'react';
import { motion } from 'motion/react';
import { Heart, ArrowRight, PlusCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const LEAF_CARDS = [
  {
    id: 1,
    category: '#01 - Trí tuệ',
    title: 'Sự Kiên Định Của Sồi',
    quote: '"Như rễ cây đâm sâu vào lòng đất, hãy vững chãi trước những bão giông của cảm xúc. Sự im lặng là sức mạnh lớn nhất của bạn lúc này."',
    image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=800&auto=format&fit=crop',
    favorite: true
  },
  {
    id: 2,
    category: '#12 - Khởi đầu',
    title: 'Dương Xỉ Nảy Chồi',
    quote: '"Mọi hành trình vĩ đại đều bắt đầu từ một sự chuyển mình nhỏ bé. Hãy cho phép bản thân được mềm yếu và dịu dàng với chính mình."',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&auto=format&fit=crop',
    favorite: false
  },
  {
    id: 3,
    category: '#08 - Buông bỏ',
    title: 'Vũ Điệu Của Phong',
    quote: '"Sự thay đổi không phải là mất mát, mà là nhường chỗ cho vẻ đẹp mới. Hãy buông tay để được cuốn trôi theo dòng chảy của định mệnh."',
    image: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=800&auto=format&fit=crop',
    favorite: false
  },
  {
    id: 4,
    category: '#24 - Thanh tịnh',
    title: 'Lá Sen Giữa Hồ',
    quote: '"Giữa những xao động của trần thế, hãy tìm về tâm điểm của sự bình yên. Mọi phiền não sẽ trôi đi như những giọt nước trên lá sen."',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
    favorite: true
  }
];

export const Collection: React.FC = () => {
  return (
    <div className="pb-20">
      <header className="mb-16 text-center lg:text-left">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-headline italic text-4xl md:text-6xl text-primary mb-4 tracking-tight"
        >
          The Leaf Collection
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-secondary text-lg max-w-2xl leading-relaxed opacity-80"
        >
          Lắng nghe lời thì thầm từ tán lá cổ xưa. Mỗi quẻ bài là một thông điệp từ sự tĩnh lặng, dẫn lối tâm hồn bạn về với bản ngã nguyên sơ.
        </motion.p>
      </header>

      <div className="flex flex-wrap gap-4 mb-12 justify-center lg:justify-start">
        {['Tất cả bài', 'Yêu thích', 'Theo tuần'].map((filter, i) => (
          <button 
            key={filter}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-colors",
              i === 0 ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {LEAF_CARDS.map((card, index) => (
          <motion.div 
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="group relative flex flex-col bg-surface-container-lowest rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5 transition-all duration-500"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img 
                src={card.image} 
                alt={card.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-tertiary">{card.category}</span>
                <Heart 
                  size={20} 
                  className={cn(card.favorite ? "fill-tertiary text-tertiary" : "text-secondary opacity-40")} 
                />
              </div>
              <h3 className="font-headline text-2xl text-primary mb-3">{card.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6 italic">
                {card.quote}
              </p>
              <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all cursor-pointer">
                <span>Chiêm nghiệm thêm</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </motion.div>
        ))}

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="group relative flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-[2.5rem] p-12 transition-all hover:bg-primary/5 hover:border-primary/40 cursor-pointer"
        >
          <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <PlusCircle size={40} className="text-primary" />
          </div>
          <h3 className="font-headline text-xl text-primary mb-2 text-center">Gieo Quẻ Mới</h3>
          <p className="text-sm text-secondary text-center opacity-70">
            Kết nối với tâm thức và nhận lấy một thông điệp lá xanh mới cho hôm nay.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
