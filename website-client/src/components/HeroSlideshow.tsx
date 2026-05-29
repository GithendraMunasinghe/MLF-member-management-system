import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  "/images/hero-1.webp",
  "/images/hero-2.webp",
  "/images/hero-3.webp",
  "/images/hero-4.webp",
];

const HeroSlideshow = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={slides[current]}
          alt="International Peace Awards Night 2025"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 hero-overlay" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <motion.img
          src="/images/logo.webp"
          alt="Logo"
          className="h-28 w-28 md:h-36 md:w-36 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        />
        <motion.p
          className="text-primary/80 uppercase tracking-[0.3em] text-sm md:text-base mb-4 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          MAHA LANKESHWARA FOUNDATION
        </motion.p>
        <motion.h1 
          className="shimmer-text text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-[0.05em] gold-gradient-text mb-6 drop-shadow-[0_4px_4_rgba(0,0,0,0.80)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          For a Proud 
          <br />
          Sri Lankan Era
        </motion.h1>

        <motion.div
          className="w-32 h-0.5 gold-gradient-bg mb-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        />
        <motion.p
          className="text-primary text-lg md:text-xl font-semibold uppercase tracking-wider mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          An unforgettable thirteen-year experience in social welfare.
        </motion.p>
        <motion.p
          className="max-w-2xl text-white text-sm md:text-base leading-relaxed drop-shadow-[0_4px_4_rgba(0,0,0,0.90)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          Maha Lankeshwara Foundation was not an organization that emerged overnight. It was built through dedication, perseverance, and the courage to overcome countless challenges. Today, with a fresh beginning and a vision for a new era, our foundation continues its journey like a flowing river moving forward with strength, unity, and purpose toward a brighter future.
        </motion.p>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-secondary/50 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-secondary/50 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === current ? "gold-gradient-bg scale-110" : "bg-foreground/30"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlideshow;
