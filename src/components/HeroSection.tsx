import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import freelancerDeveloper from '@/assets/freelancer-developer.png';
import freelancerDesigner from '@/assets/freelancer-designer.png';
import freelancerWaiter from '@/assets/freelancer-waiter.png';
import freelancerHandyman from '@/assets/freelancer-handyman.png';
import freelancerPhotographer from '@/assets/freelancer-photographer.png';
import WaitlistForm from './WaitlistForm';

const freelancers = [
  {
    id: 1,
    image: freelancerDeveloper,
    title: "Desenvolvedor",
    color: "from-blue-500/20 to-purple-500/20"
  },
  {
    id: 2,
    image: freelancerDesigner,
    title: "Designer",
    color: "from-pink-500/20 to-orange-500/20"
  },
  {
    id: 3,
    image: freelancerWaiter,
    title: "Garçom",
    color: "from-amber-500/20 to-red-500/20"
  },
  {
    id: 4,
    image: freelancerHandyman,
    title: "Trabalhador Manual",
    color: "from-yellow-500/20 to-green-500/20"
  },
  {
    id: 5,
    image: freelancerPhotographer,
    title: "Fotógrafa",
    color: "from-teal-500/20 to-cyan-500/20"
  }
];

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Smooth spring animations for scroll
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Parallax transforms for freelancers based on scroll
  const y1 = useTransform(smoothProgress, [0, 1], [0, -100]);
  const y2 = useTransform(smoothProgress, [0, 1], [0, -150]);
  const y3 = useTransform(smoothProgress, [0, 1], [0, -80]);

  const rotate1 = useTransform(smoothProgress, [0, 1], [0, -8]);
  const rotate2 = useTransform(smoothProgress, [0, 1], [0, 5]);

  const scale = useTransform(smoothProgress, [0, 0.5], [1, 0.95]);
  const opacity = useTransform(smoothProgress, [0, 0.8], [1, 0]);

  // Auto-rotate carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % freelancers.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Text animation variants
  const headlineWords = ["Transforme", "seu", "tempo", "livre", "em", "oportunidades"];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3,
      }
    }
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      }
    }
  };

  // Get visible freelancers for carousel (shows 3 at a time with different positions)
  const getVisibleFreelancers = () => {
    const result = [];
    for (let i = -2; i <= 2; i++) {
      const index = (activeIndex + i + freelancers.length) % freelancers.length;
      result.push({
        ...freelancers[index],
        position: i,
        originalIndex: index
      });
    }
    return result;
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-background !pt-0 !mt-0"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-transparent" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      <motion.div
        style={{ scale, opacity }}
        className="relative z-10 container-wide pt-20 md:pt-28 lg:pt-32"
      >
        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="absolute top-0 left-0 right-0 py-6 px-6"
        >
          <div className="container-wide flex items-center justify-between">
            <motion.div
              className="text-2xl font-bold text-foreground"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-gradient">Freelex</span>
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#como-funciona" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Como funciona
              </a>
              <a href="#beneficios" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Benefícios
              </a>
              <a href="#nosso-app" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Nosso App
              </a>
              <a href="#depoimentos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Depoimentos
              </a>
              <motion.button
                className="btn-hero rounded-full text-sm text-primary-foreground"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (document.querySelector('input[type="email"]') as HTMLInputElement)?.focus()}
              >
                Entrar na Lista
              </motion.button>
            </div>
          </div>
        </motion.nav>

        {/* Main Hero Content */}
        <div className="text-center max-w-5xl mx-auto px-4">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Lista de espera aberta</span>
          </motion.div>

          {/* Headline with word-by-word animation */}
          <motion.h1
            className="headline-xl text-foreground mb-6 perspective-1000"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {headlineWords.map((word, index) => (
              <motion.span
                key={index}
                variants={wordVariants}
                className="inline-block mr-4 last:mr-0"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="subheadline max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: [0.4, 0, 0.2, 1] }}
          >
            Conectamos os melhores freelancers com empresas que buscam talentos.
            Encontre projetos, negocie valores e construa sua carreira.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1, ease: [0.4, 0, 0.2, 1] }}
          >
            <WaitlistForm className="mt-4" />
          </motion.div>
        </div>

        {/* Freelancers Carousel Section */}
        <motion.div
          className="relative mt-16 md:mt-24 h-[500px] md:h-[600px] lg:h-[700px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Animated Freelancers Carousel */}
          <div className="relative h-full flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              {getVisibleFreelancers().map((freelancer) => {
                const isCenter = freelancer.position === 0;
                const isLeft = freelancer.position < 0;
                const isRight = freelancer.position > 0;
                const absPosition = Math.abs(freelancer.position);

                // Calculate position-based transforms
                const xOffset = freelancer.position * 180;
                const scaleValue = isCenter ? 1 : 0.7 - (absPosition * 0.1);
                const opacityValue = isCenter ? 1 : 0.5 - (absPosition * 0.15);
                const zIndex = 10 - absPosition;
                const rotateY = freelancer.position * -15;

                // Use different parallax based on position
                const yTransform = isCenter ? y2 : isLeft ? y1 : y3;
                const rotateTransform = isLeft ? rotate1 : rotate2;

                return (
                  <motion.div
                    key={`${freelancer.id}-${freelancer.position}`}
                    className="absolute cursor-pointer"
                    initial={{
                      opacity: 0,
                      x: xOffset + (isLeft ? -200 : isRight ? 200 : 0),
                      scale: 0.5,
                      rotateY: rotateY * 2
                    }}
                    animate={{
                      opacity: opacityValue,
                      x: xOffset,
                      scale: scaleValue,
                      rotateY: rotateY,
                    }}
                    exit={{
                      opacity: 0,
                      x: xOffset + (isLeft ? -200 : isRight ? 200 : 0),
                      scale: 0.3,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 25,
                      mass: 1
                    }}
                    style={{
                      zIndex,
                      perspective: '1000px',
                      transformStyle: 'preserve-3d'
                    }}
                    onClick={() => setActiveIndex(freelancer.originalIndex)}
                  >
                    <motion.div
                      style={{
                        y: isCenter ? yTransform : undefined,
                        rotateZ: isCenter ? rotateTransform : undefined
                      }}
                    >
                      {/* Floating animation */}
                      <motion.div
                        animate={{
                          y: [0, -15 - (absPosition * 5), 0],
                          rotate: [0, isLeft ? -2 : isRight ? 2 : 0, 0]
                        }}
                        transition={{
                          duration: 4 + (absPosition * 0.5),
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: absPosition * 0.3
                        }}
                        className="relative"
                      >
                        {/* Soft shadow applied to the person */}
                        <div
                          className="relative"
                          style={{
                            filter: `drop-shadow(0 ${20 + absPosition * 10}px ${30 + absPosition * 15}px rgba(0,0,0,${0.15 - absPosition * 0.03}))`
                          }}
                        >
                          <img
                            src={freelancer.image}
                            alt={freelancer.title}
                            className={`w-[200px] md:w-[280px] lg:w-[340px] h-auto object-contain transition-all duration-500 ${isCenter ? '' : 'grayscale-[30%]'
                              }`}
                            style={{
                              mixBlendMode: 'normal'
                            }}
                          />
                        </div>

                        {/* Glow effect for center freelancer */}
                        {isCenter && (
                          <motion.div
                            className="absolute inset-0 -z-10 blur-3xl opacity-20 bg-primary rounded-full scale-50"
                            animate={{
                              scale: [0.5, 0.6, 0.5],
                              opacity: [0.2, 0.3, 0.2]
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        )}

                        {/* Title badge for center */}
                        {isCenter && (
                          <motion.div
                            className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-card/90 backdrop-blur-sm rounded-full border border-border shadow-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ delay: 0.2 }}
                          >
                            <span className="text-sm font-medium text-foreground whitespace-nowrap">
                              {freelancer.title}
                            </span>
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Carousel Navigation Dots */}
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            {freelancers.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative h-2 rounded-full transition-all duration-500 ${index === activeIndex
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-border hover:bg-primary/50'
                  }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                {index === activeIndex && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <motion.div
            className="scroll-indicator"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
