import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

interface CursorState {
  isHovering: boolean;
  isClicking: boolean;
  hoverText: string | null;
  magneticTarget: { x: number; y: number } | null;
  cursorType: 'default' | 'link' | 'button' | 'text' | 'drag';
}

const CustomCursor = () => {
  const [cursorState, setCursorState] = useState<CursorState>({
    isHovering: false,
    isClicking: false,
    hoverText: null,
    magneticTarget: null,
    cursorType: 'default'
  });
  
  const [isVisible, setIsVisible] = useState(false);
  
  // Cursor position with smooth spring animation
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Outer ring follows with more delay
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);
  
  // Inner dot is more responsive
  const dotSpringConfig = { damping: 35, stiffness: 500, mass: 0.2 };
  const dotX = useSpring(cursorX, dotSpringConfig);
  const dotY = useSpring(cursorY, dotSpringConfig);
  
  const rafRef = useRef<number>();

  useEffect(() => {
    // Check if device supports hover (not touch)
    const hasHover = window.matchMedia('(hover: hover)').matches;
    if (!hasHover) return;

    const updateCursor = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      
      rafRef.current = requestAnimationFrame(() => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
        
        if (!isVisible) setIsVisible(true);
      });
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    
    const handleMouseDown = () => setCursorState(prev => ({ ...prev, isClicking: true }));
    const handleMouseUp = () => setCursorState(prev => ({ ...prev, isClicking: false }));

    // Add magnetic effect to interactive elements
    const addMagneticEffect = () => {
      const interactiveElements = document.querySelectorAll('a, button, [data-cursor="magnetic"], [role="button"]');
      
      interactiveElements.forEach((el) => {
        const element = el as HTMLElement;
        
        const handleEnter = () => {
          const cursorType = element.dataset.cursorType as CursorState['cursorType'] || 
                            (element.tagName === 'BUTTON' ? 'button' : 'link');
          const hoverText = element.dataset.cursorText || null;
          
          setCursorState(prev => ({
            ...prev,
            isHovering: true,
            cursorType,
            hoverText
          }));
        };
        
        const handleLeave = () => {
          setCursorState(prev => ({
            ...prev,
            isHovering: false,
            cursorType: 'default',
            hoverText: null,
            magneticTarget: null
          }));
        };
        
        const handleMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          // Calculate magnetic pull (subtle attraction toward center)
          const magnetStrength = 0.3;
          const magnetX = centerX + (e.clientX - centerX) * (1 - magnetStrength);
          const magnetY = centerY + (e.clientY - centerY) * (1 - magnetStrength);
          
          setCursorState(prev => ({
            ...prev,
            magneticTarget: { x: magnetX, y: magnetY }
          }));
        };
        
        element.addEventListener('mouseenter', handleEnter);
        element.addEventListener('mouseleave', handleLeave);
        element.addEventListener('mousemove', handleMove as EventListener);
        
        // Store cleanup functions
        (element as any).__cursorCleanup = () => {
          element.removeEventListener('mouseenter', handleEnter);
          element.removeEventListener('mouseleave', handleLeave);
          element.removeEventListener('mousemove', handleMove as EventListener);
        };
      });
    };

    // Initial setup
    addMagneticEffect();
    
    // MutationObserver to handle dynamically added elements
    const observer = new MutationObserver(() => {
      addMagneticEffect();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Hide default cursor
    document.body.style.cursor = 'none';
    document.querySelectorAll('a, button').forEach(el => {
      (el as HTMLElement).style.cursor = 'none';
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      
      // Cleanup magnetic effects
      document.querySelectorAll('a, button, [data-cursor="magnetic"]').forEach(el => {
        if ((el as any).__cursorCleanup) {
          (el as any).__cursorCleanup();
        }
      });
    };
  }, [cursorX, cursorY, isVisible]);

  // Calculate cursor sizes based on state
  const getOuterSize = () => {
    if (cursorState.isClicking) return 35;
    if (cursorState.isHovering) return 60;
    return 40;
  };

  const getInnerSize = () => {
    if (cursorState.isClicking) return 4;
    if (cursorState.isHovering) return 0;
    return 6;
  };

  // Don't render on touch devices
  if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover)').matches) {
    return null;
  }

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: smoothX,
          y: smoothY,
        }}
        animate={{
          width: getOuterSize(),
          height: getOuterSize(),
          opacity: isVisible ? 1 : 0,
          scale: cursorState.isClicking ? 0.9 : 1,
        }}
        transition={{
          width: { type: "spring", stiffness: 400, damping: 25 },
          height: { type: "spring", stiffness: 400, damping: 25 },
          opacity: { duration: 0.2 },
          scale: { type: "spring", stiffness: 500, damping: 20 },
        }}
      >
        <motion.div
          className="absolute rounded-full border-2"
          style={{
            width: '100%',
            height: '100%',
            transform: 'translate(-50%, -50%)',
            borderColor: cursorState.isHovering 
              ? 'hsl(var(--primary))' 
              : 'hsl(0, 0%, 100%)',
            backgroundColor: cursorState.isHovering 
              ? 'hsl(var(--primary) / 0.1)' 
              : 'transparent',
          }}
          animate={{
            borderWidth: cursorState.isHovering ? 2 : 1.5,
            rotate: cursorState.isHovering ? 90 : 0,
          }}
          transition={{
            rotate: { duration: 0.4, ease: "easeOut" },
            borderWidth: { duration: 0.2 },
          }}
        />
        
        {/* Hover text label */}
        <AnimatePresence>
          {cursorState.hoverText && (
            <motion.span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-white whitespace-nowrap"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              {cursorState.hoverText}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
        }}
        animate={{
          width: getInnerSize(),
          height: getInnerSize(),
          opacity: isVisible && !cursorState.isHovering ? 1 : 0,
        }}
        transition={{
          width: { type: "spring", stiffness: 500, damping: 25 },
          height: { type: "spring", stiffness: 500, damping: 25 },
          opacity: { duration: 0.15 },
        }}
      >
        <div
          className="absolute rounded-full bg-white"
          style={{
            width: '100%',
            height: '100%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </motion.div>
      
      {/* Magnetic trail effect */}
      <AnimatePresence>
        {cursorState.isHovering && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9998]"
            style={{
              x: smoothX,
              y: smoothY,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3, scale: 1.5 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="absolute w-16 h-16 rounded-full bg-primary/20 blur-xl"
              style={{
                transform: 'translate(-50%, -50%)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomCursor;
