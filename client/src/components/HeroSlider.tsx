import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSliderProps {
  currentSlide: number;
  slides: Array<{ title: string; subtitle: string; image: string }>;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onGoToSlide: (index: number) => void;
}

const HeroSlider = ({ currentSlide, slides, onPrevSlide, onNextSlide, onGoToSlide }: HeroSliderProps) => {
  if (slides.length === 0) {
    return null;
  }

  const safeSlideIndex = ((currentSlide % slides.length) + slides.length) % slides.length;
  return (
    <section className="relative h-[280px] sm:h-[380px] lg:h-[540px] xl:h-[620px] overflow-hidden bg-[#EFEFEF]">
      {slides.map((slide, index) => (
        <motion.img
          key={`${slide.image}-${index}`}
          src={slide.image}
          alt={slide.title}
          className="absolute inset-0 h-full w-full object-cover object-center"
          initial={false}
          animate={{
            opacity: index === safeSlideIndex ? 1 : 0,
            scale: index === safeSlideIndex ? 1 : 1.03,
          }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent" />

      {/* Slider Controls */}
      <button
        onClick={onPrevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-primary text-[#666666] hover:text-white p-1.5 sm:p-2 rounded-full transition-all z-10 cursor-pointer backdrop-blur-sm"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={onNextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-primary text-[#666666] hover:text-white p-1.5 sm:p-2 rounded-full transition-all z-10 cursor-pointer backdrop-blur-sm"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {slides.map((slide, index) => (
          <button
            key={`${slide.title}-${index}`}
            onClick={() => onGoToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === safeSlideIndex ? 'w-6 bg-primary' : 'w-2 bg-[#D4D4D4] hover:bg-[#BFBFBF]'
            }`}
            aria-label={`Chuyển đến slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
