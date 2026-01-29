import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import { Briefcase, Users, Shield, Zap } from 'lucide-react';

const steps = [
  {
    icon: Briefcase,
    title: "Crie seu perfil",
    description: "Cadastre suas habilidades, portfolio e experiência em minutos.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Users,
    title: "Conecte-se",
    description: "Encontre clientes ou freelancers ideais para seus projetos.",
    color: "from-violet-500 to-purple-500"
  },
  {
    icon: Shield,
    title: "Negocie com segurança",
    description: "Pagamentos protegidos e contratos inteligentes garantem sua tranquilidade.",
    color: "from-emerald-500 to-teal-500"
  },
  {
    icon: Zap,
    title: "Entregue resultados",
    description: "Trabalhe, entregue e receba. Simples assim.",
    color: "from-amber-500 to-orange-500"
  }
];

const HowItWorksSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const headerY = useTransform(smoothProgress, [0, 0.5], [40, 0]);
  const headerOpacity = useTransform(smoothProgress, [0, 0.3], [0, 1]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
      }
    }
  };

  return (
    <section 
      id="como-funciona"
      ref={containerRef}
      className="section-padding bg-background relative overflow-hidden"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      
      <div className="container-wide relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          <motion.span 
            className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary text-sm font-medium mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Como funciona
          </motion.span>
          
          <motion.h2 
            className="headline-lg text-foreground mb-6"
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Comece em <span className="text-gradient">4 passos simples</span>
          </motion.h2>
          
          <motion.p 
            className="subheadline"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Do cadastro à primeira entrega, simplificamos cada etapa da sua jornada freelancer.
          </motion.p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={cardVariants}
              whileHover={{ 
                y: -8, 
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="group relative"
              data-cursor="magnetic"
            >
              <div className="card-feature h-full">
                {/* Step number */}
                <motion.div 
                  className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                >
                  {index + 1}
                </motion.div>

                {/* Icon */}
                <motion.div 
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg mb-6`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <step.icon className="w-7 h-7 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {/* Connecting line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-4 w-8 h-0.5 bg-border overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary origin-left"
                      initial={{ scaleX: 0 }}
                      animate={isInView ? { scaleX: 1 } : {}}
                      transition={{ delay: 0.7 + index * 0.15, duration: 0.5 }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
