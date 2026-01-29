import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { TrendingUp, Clock, Globe, CreditCard, Star, Lock } from 'lucide-react';

const benefits = [
  {
    icon: TrendingUp,
    title: "Ganhos sem limite",
    description: "Defina seus próprios preços e aumente sua renda de acordo com sua dedicação.",
    stat: "+40%",
    statLabel: "de aumento médio"
  },
  {
    icon: Clock,
    title: "Flexibilidade total",
    description: "Trabalhe quando e onde quiser. Você controla seu próprio tempo.",
    stat: "24/7",
    statLabel: "disponibilidade"
  },
  {
    icon: Globe,
    title: "Alcance global",
    description: "Conecte-se com clientes de todo o Brasil e expanda sua rede.",
    stat: "50k+",
    statLabel: "usuários ativos"
  },
  {
    icon: CreditCard,
    title: "Pagamento garantido",
    description: "Sistema de escrow protege seu trabalho. Receba sempre pelo que entrega.",
    stat: "100%",
    statLabel: "seguro"
  },
  {
    icon: Star,
    title: "Reputação que vale",
    description: "Construa sua credibilidade com avaliações reais de clientes satisfeitos.",
    stat: "4.9",
    statLabel: "média de avaliação"
  },
  {
    icon: Lock,
    title: "Contratos inteligentes",
    description: "Termos claros, escopo definido. Proteção legal para ambas as partes.",
    stat: "0%",
    statLabel: "de calotes"
  }
];

const BenefitsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const patternY = useTransform(smoothProgress, [0, 1], [0, -80]);
  const headerScale = useTransform(smoothProgress, [0, 0.3], [0.95, 1]);
  const headerOpacity = useTransform(smoothProgress, [0, 0.2], [0, 1]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: (index: number) => ({ 
      opacity: 0, 
      y: 60,
      x: index % 3 === 0 ? -40 : index % 3 === 2 ? 40 : 0,
      scale: 0.9,
      rotateY: index % 2 === 0 ? -15 : 15,
    }),
    visible: { 
      opacity: 1, 
      y: 0,
      x: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 15,
        mass: 1
      }
    }
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 150,
        damping: 12,
        delay: 0.3
      }
    }
  };

  return (
    <section 
      id="beneficios"
      ref={containerRef}
      className="section-padding bg-secondary/30 relative overflow-hidden"
    >
      {/* Animated background pattern */}
      <motion.div 
        className="absolute inset-0 opacity-[0.015]"
        style={{ y: patternY }}
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </motion.div>

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-primary/5 blur-3xl"
          animate={{
            y: [0, -40, 0],
            x: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full bg-primary/5 blur-3xl"
          animate={{
            y: [0, 50, 0],
            x: [0, -40, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container-wide relative z-10">
        {/* Section Header with scroll animations */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          style={{ scale: headerScale, opacity: headerOpacity }}
        >
          <motion.span 
            className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 150 }}
          >
            Benefícios
          </motion.span>
          
          <motion.h2 
            className="headline-lg text-foreground mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Por que escolher o <span className="text-gradient">Freelex</span>?
          </motion.h2>
          
          <motion.p 
            className="subheadline"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            Ferramentas poderosas, proteção completa e uma comunidade que cresce junto com você.
          </motion.p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 perspective-1000"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              custom={index}
              variants={itemVariants}
              whileHover={{ 
                y: -12, 
                scale: 1.03,
                rotateY: 5,
                rotateX: -3,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="group preserve-3d"
              data-cursor="magnetic"
            >
              <div className="relative p-8 rounded-3xl bg-card border border-border/50 h-full overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-2xl preserve-3d">
                {/* Gradient overlay on hover */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100"
                  initial={false}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon with enhanced animation */}
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:shadow-glow transition-all duration-500"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    initial={{ scale: 0, rotate: -45 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ delay: 0.4 + index * 0.1, type: "spring", stiffness: 200 }}
                  >
                    <benefit.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                  </motion.div>

                  {/* Stat badge with animation */}
                  <motion.div 
                    className="absolute top-6 right-6"
                    variants={statVariants}
                  >
                    <div className="text-right">
                      <motion.div 
                        className="text-2xl font-bold text-gradient"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {benefit.stat}
                      </motion.div>
                      <div className="text-xs text-muted-foreground">{benefit.statLabel}</div>
                    </div>
                  </motion.div>

                  <motion.h3 
                    className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {benefit.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-muted-foreground leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    {benefit.description}
                  </motion.p>
                </div>

                {/* Decorative corner with animation */}
                <motion.div 
                  className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-primary/5 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1.2 }}
                />

                {/* Animated border glow */}
                <motion.div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--primary) / 0.2) 0%, transparent 50%, hsl(var(--primary) / 0.1) 100%)',
                  }}
                  initial={false}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
