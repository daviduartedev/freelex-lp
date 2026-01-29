import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Carolina Santos",
    role: "Designer UX/UI",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    content: "O Freelex transformou completamente minha carreira. Em 6 meses consegui triplicar minha renda trabalhando com clientes incríveis.",
    rating: 5,
    earnings: "R$ 45.000/mês"
  },
  {
    id: 2,
    name: "Ricardo Mendes",
    role: "Desenvolvedor Full Stack",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    content: "A segurança nos pagamentos é o que mais me impressiona. Nunca tive problemas e o suporte é excepcional.",
    rating: 5,
    earnings: "R$ 32.000/mês"
  },
  {
    id: 3,
    name: "Amanda Oliveira",
    role: "Redatora e Copywriter",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    content: "Finalmente encontrei uma plataforma que valoriza o trabalho do freelancer. Os clientes são sérios e os projetos são desafiadores.",
    rating: 5,
    earnings: "R$ 28.000/mês"
  },
  {
    id: 4,
    name: "Fernando Costa",
    role: "Motion Designer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    content: "A qualidade dos projetos aqui é incomparável. Trabalho com grandes marcas e tenho liberdade total.",
    rating: 5,
    earnings: "R$ 52.000/mês"
  }
];

const TestimonialsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const orbY1 = useTransform(smoothProgress, [0, 1], [0, -100]);
  const orbY2 = useTransform(smoothProgress, [0, 1], [0, 80]);
  const headerY = useTransform(smoothProgress, [0, 0.3], [50, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const cardVariants = {
    hidden: (index: number) => ({ 
      opacity: 0, 
      y: 70,
      x: index % 2 === 0 ? -50 : 50,
      scale: 0.85,
      rotateX: -10,
    }),
    visible: { 
      opacity: 1, 
      y: 0,
      x: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 15,
        mass: 1
      }
    }
  };

  const quoteVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -45 },
    visible: { 
      opacity: 0.1, 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 150,
        damping: 15,
        delay: 0.4
      }
    }
  };

  return (
    <section 
      id="depoimentos"
      ref={containerRef}
      className="section-padding bg-secondary/30 relative overflow-hidden"
    >
      {/* Animated floating orbs */}
      <motion.div 
        className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        style={{ y: orbY1 }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        style={{ y: orbY2 }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container-wide relative z-10">
        {/* Section Header with scroll animation */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          style={{ y: headerY }}
        >
          <motion.span 
            className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 150 }}
          >
            Depoimentos
          </motion.span>
          
          <motion.h2 
            className="headline-lg text-foreground mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Histórias de <span className="text-gradient">sucesso real</span>
          </motion.h2>
          
          <motion.p 
            className="subheadline"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            Veja como milhares de profissionais estão transformando suas carreiras com o Freelex.
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto perspective-1000"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              custom={index}
              variants={cardVariants}
              whileHover={{ 
                y: -12, 
                scale: 1.03,
                rotateY: 5,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="group preserve-3d"
              data-cursor="magnetic"
            >
              <div className="relative p-8 rounded-3xl bg-card border border-border/50 h-full overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-2xl">
                {/* Quote icon with animation */}
                <motion.div variants={quoteVariants}>
                  <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10 group-hover:text-primary/20 transition-colors duration-500" />
                </motion.div>
                
                {/* Rating with staggered animation */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                      transition={{ 
                        delay: 0.6 + index * 0.15 + i * 0.08,
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      <Star className="w-4 h-4 fill-primary text-primary" />
                    </motion.div>
                  ))}
                </div>

                {/* Content with animation */}
                <motion.p 
                  className="text-foreground text-lg leading-relaxed mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.15 }}
                >
                  "{testimonial.content}"
                </motion.p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <motion.img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.6 + index * 0.15, type: "spring", stiffness: 150 }}
                  />
                  <motion.div 
                    className="flex-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.7 + index * 0.15 }}
                  >
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </motion.div>
                  <motion.div 
                    className="text-right"
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.8 + index * 0.15 }}
                  >
                    <div className="text-sm text-muted-foreground">Ganhando</div>
                    <motion.div 
                      className="font-bold text-gradient"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
                    >
                      {testimonial.earnings}
                    </motion.div>
                  </motion.div>
                </div>

                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats with enhanced animation */}
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mt-16 pt-16 border-t border-border"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
        >
          {[
            { value: "50.000+", label: "Freelancers ativos" },
            { value: "R$ 120M+", label: "Pagos aos freelancers" },
            { value: "4.9/5", label: "Avaliação média" },
            { value: "98%", label: "Taxa de satisfação" },
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 1.1 + index * 0.15, type: "spring", stiffness: 150 }}
              whileHover={{ scale: 1.1, y: -5 }}
            >
              <motion.div 
                className="text-3xl md:text-4xl font-bold text-gradient mb-1"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
