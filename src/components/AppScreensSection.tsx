import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import appScreen from '@/assets/app-screen.png';

const AppScreensSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking for 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Scroll-driven parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  // Enhanced parallax transforms
  const yPhone = useTransform(smoothProgress, [0, 1], [150, -150]);
  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [15, 0, -15]);
  const rotateY = useTransform(smoothProgress, [0, 0.5, 1], [-10, 0, 10]);
  const scalePhone = useTransform(smoothProgress, [0, 0.5, 1], [0.85, 1.05, 0.85]);
  
  // Glow intensity based on scroll
  const glowOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.1, 0.4, 0.1]);
  const glowScale = useTransform(smoothProgress, [0, 0.5, 1], [0.6, 1, 0.6]);

  // Header parallax
  const headerY = useTransform(smoothProgress, [0, 0.3], [60, 0]);
  const headerOpacity = useTransform(smoothProgress, [0, 0.2], [0, 1]);

  // Handle mouse move for 3D tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    mouseX.set(x * 15);
    mouseY.set(y * -15);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <section 
      id="nosso-app"
      ref={containerRef}
      className="section-padding bg-background relative overflow-hidden"
    >
      {/* Animated background gradient */}
      <motion.div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, hsl(var(--primary) / 0.08) 0%, transparent 70%)'
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Multiple animated orbs */}
      <motion.div 
        className="absolute top-1/4 left-1/6 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/6 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[80px]"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -40, 0],
          y: [0, 40, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]"
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 180, 360],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/30"
          style={{
            left: `${15 + i * 10}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, (i % 2 === 0 ? 20 : -20), 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}
      
      <div className="container-wide relative z-10">
        {/* Section Header with enhanced scroll animation */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12 md:mb-20"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          <motion.span 
            className="inline-block px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05, backgroundColor: 'hsl(var(--primary) / 0.15)' }}
          >
            ✨ Nosso App
          </motion.span>
          
          <motion.h2 
            className="headline-lg text-foreground mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Tudo que você precisa, <span className="text-gradient">na palma da mão</span>
          </motion.h2>
          
          <motion.p 
            className="subheadline text-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Interface intuitiva projetada para maximizar sua produtividade e facilitar conexões.
          </motion.p>
        </motion.div>

        {/* Large Central Image with 3D effects */}
        <motion.div 
          className="relative flex items-center justify-center min-h-[600px] md:min-h-[800px] lg:min-h-[900px]"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <motion.div
            ref={imageRef}
            className="relative w-[90%] md:w-[80%] lg:w-[70%] max-w-[900px] perspective-1000"
            style={{ 
              y: yPhone, 
              rotateX: rotateX,
              rotateY: rotateY,
              scale: scalePhone,
              transformStyle: 'preserve-3d',
            }}
            initial={{ opacity: 0, y: 150, scale: 0.6, rotateX: 30 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
            transition={{ 
              duration: 1.2, 
              delay: 0.5,
              type: "spring",
              stiffness: 60,
              damping: 15
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            data-cursor="magnetic"
          >
            {/* Multiple layered glow effects */}
            <motion.div 
              className="absolute inset-0 -z-20 blur-[100px] bg-primary rounded-3xl"
              style={{ 
                opacity: glowOpacity,
                scale: glowScale,
              }}
            />
            <motion.div 
              className="absolute inset-0 -z-10 blur-[60px] bg-primary/30 rounded-3xl scale-90"
              animate={{ 
                opacity: [0.2, 0.4, 0.2],
                scale: [0.85, 0.95, 0.85],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut"
              }}
            />

            {/* Main floating animation container */}
            <motion.div
              animate={{ 
                y: [0, -30, 0],
                rotateZ: [-1, 1, -1],
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut"
              }}
              className="relative"
            >
              {/* 3D tilt wrapper */}
              <motion.div
                style={{
                  rotateY: mouseX,
                  rotateX: mouseY,
                  transformStyle: 'preserve-3d',
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Image with shadow and border */}
                <motion.div
                  className="relative rounded-2xl md:rounded-3xl overflow-hidden"
                  style={{
                    boxShadow: isHovered 
                      ? '0 60px 120px -20px rgba(0,0,0,0.4), 0 30px 60px -15px hsl(var(--primary) / 0.3)'
                      : '0 50px 100px -20px rgba(0,0,0,0.3), 0 25px 50px -12px hsl(var(--primary) / 0.2)',
                  }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  <img 
                    src={appScreen} 
                    alt="Freelex App - Interface do aplicativo" 
                    className="w-full h-auto"
                  />
                  
                  {/* Animated shine overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={isHovered ? { x: '100%', opacity: 1 } : { x: '-100%', opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                  
                  {/* Gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 pointer-events-none" />
                </motion.div>

                {/* Floating UI elements around the image */}
                <motion.div
                  className="absolute -top-6 -right-6 md:-top-10 md:-right-10 px-4 py-2 md:px-6 md:py-3 bg-card/95 backdrop-blur-md rounded-xl md:rounded-2xl shadow-xl border border-border/50"
                  initial={{ opacity: 0, scale: 0, x: 50 }}
                  animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
                  transition={{ delay: 1, duration: 0.6, type: "spring" }}
                  style={{ transform: 'translateZ(40px)' }}
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-xl md:text-2xl">🚀</span>
                    <span className="text-xs md:text-sm font-semibold text-foreground">+50k usuários</span>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 px-4 py-2 md:px-6 md:py-3 bg-card/95 backdrop-blur-md rounded-xl md:rounded-2xl shadow-xl border border-border/50"
                  initial={{ opacity: 0, scale: 0, x: -50 }}
                  animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
                  transition={{ delay: 1.2, duration: 0.6, type: "spring" }}
                  style={{ transform: 'translateZ(40px)' }}
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-xl md:text-2xl">⭐</span>
                    <span className="text-xs md:text-sm font-semibold text-foreground">4.9 na App Store</span>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 px-3 py-2 md:px-4 md:py-3 bg-primary text-primary-foreground rounded-xl md:rounded-2xl shadow-xl"
                  initial={{ opacity: 0, scale: 0, x: 50 }}
                  animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
                  transition={{ delay: 1.4, duration: 0.6, type: "spring" }}
                  style={{ transform: 'translateZ(60px)' }}
                >
                  <motion.div
                    animate={{ 
                      y: [0, -8, 0],
                      rotate: [0, 5, 0],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-lg md:text-xl">💰</span>
                    <span className="text-xs md:text-sm font-bold">Grátis</span>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AppScreensSection;
