import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSliderProps {
  currentSlide: number;
  slides: Array<{ title: string; subtitle: string; image: string }>;
  onPrevSlide: () => void;
  onNextSlide: () => void;
}

const HeroSlider = ({ currentSlide, slides, onPrevSlide, onNextSlide }: HeroSliderProps) => {
  return (
    <section className="relative h-[542px] bg-white overflow-hidden">
      <motion.div
        key={currentSlide}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="text-center">
          <motion.img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="mx-auto max-w-4xl w-full h-auto"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.7 }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-4xl font-bold text-[#333333] mt-8"
          >
            {slides[currentSlide].title}
          </motion.h1>
        </div>
      </motion.div>

      {/* Slider Controls */}
      <button
        onClick={onPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#EAEAEA] hover:bg-primary text-[#CCCCCC] hover:text-white p-2 rounded-full transition-all z-10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={onNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#EAEAEA] hover:bg-primary text-[#CCCCCC] hover:text-white p-2 rounded-full transition-all z-10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </section>
  );
};

export default HeroSlider;
