import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface Trail {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface Shape {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: 'square' | 'circle' | 'rectangle' | 'rhombus';
  color: string;
  glow: boolean;
}

export default function AboutPage() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [trailId, setTrailId] = useState(0);
  const [shapes, setShapes] = useState<Shape[]>([]);

  const springConfig = { damping: 30, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Initialize shapes
  useEffect(() => {
    const colors = ['border-red-500/30', 'border-red-600/25', 'border-white/20', 'border-red-400/35'];
    const centerX = (typeof window !== 'undefined' ? window.innerWidth / 2 : 960);
    const centerY = (typeof window !== 'undefined' ? window.innerHeight / 2 : 540);
    
    const shapeConfigs = [
      { type: 'circle' as const, size: 80, speed: 2.0 },
      { type: 'circle' as const, size: 90, speed: 1.8 },
      { type: 'circle' as const, size: 85, speed: 2.2 },
      { type: 'circle' as const, size: 200, speed: 0.5 },
      { type: 'square' as const, size: 130, speed: 1.2 },
      { type: 'square' as const, size: 140, speed: 1.0 },
      { type: 'rhombus' as const, size: 70, speed: 2.5 },
      { type: 'rhombus' as const, size: 75, speed: 2.3 },
      { type: 'rhombus' as const, size: 80, speed: 2.0 }
    ];
    
    const initialShapes: Shape[] = shapeConfigs.map((config, i) => {
      const angle = (i / shapeConfigs.length) * Math.PI * 2;
      const distance = 200 + Math.random() * 300;
      
      return {
        id: i,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        size: config.size,
        type: config.type,
        color: colors[Math.floor(Math.random() * colors.length)],
        glow: false
      };
    });
    
    setShapes(initialShapes);
  }, []);

  // Animate shapes with collision detection
  useEffect(() => {
    if (shapes.length === 0) return;
    
    const animationFrame = setInterval(() => {
      setShapes(prevShapes => {
        const newShapes = prevShapes.map(shape => {
          let newX = shape.x + shape.vx;
          let newY = shape.y + shape.vy;
          let newVx = shape.vx;
          let newVy = shape.vy;

          if (newX <= 0 || newX >= (typeof window !== 'undefined' ? window.innerWidth - shape.size : 1920)) {
            newVx = -newVx;
            newX = Math.max(0, Math.min(newX, (typeof window !== 'undefined' ? window.innerWidth - shape.size : 1920)));
          }
          if (newY <= 0 || newY >= (typeof window !== 'undefined' ? window.innerHeight - shape.size : 1080)) {
            newVy = -newVy;
            newY = Math.max(0, Math.min(newY, (typeof window !== 'undefined' ? window.innerHeight - shape.size : 1080)));
          }

          return { ...shape, x: newX, y: newY, vx: newVx, vy: newVy };
        });

        for (let i = 0; i < newShapes.length; i++) {
          for (let j = i + 1; j < newShapes.length; j++) {
            const dx = newShapes[i].x - newShapes[j].x;
            const dy = newShapes[i].y - newShapes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = (newShapes[i].size + newShapes[j].size) / 2 + 30;

            if (distance < minDistance) {
              const angle = Math.atan2(dy, dx);
              const targetX = newShapes[j].x + Math.cos(angle) * minDistance;
              const targetY = newShapes[j].y + Math.sin(angle) * minDistance;
              
              newShapes[i].vx = (targetX - newShapes[j].x) * 0.05;
              newShapes[i].vy = (targetY - newShapes[j].y) * 0.05;
              newShapes[j].vx = -newShapes[i].vx;
              newShapes[j].vy = -newShapes[i].vy;
            }
          }
        }

        return newShapes;
      });
    }, 50);

    return () => clearInterval(animationFrame);
  }, [shapes.length]);

  // Random glow effect
  useEffect(() => {
    const glowInterval = setInterval(() => {
      setShapes(prev => prev.map(shape => (
        {
          ...shape,
          glow: Math.random() > 0.7
        }
      )));
    }, 2000);

    return () => clearInterval(glowInterval);
  }, []);

  useEffect(() => {
    let lastTime = Date.now();
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 150);
      mouseY.set(e.clientY - 150);
      
      const now = Date.now();
      if (now - lastTime > 50) {
        const newTrail: Trail = {
          id: trailId,
          x: e.clientX,
          y: e.clientY,
          color: Math.random() > 0.5 ? 'bg-red-500' : 'bg-sky-400'
        };
        setTrails(prev => [...prev.slice(-20), newTrail]);
        setTrailId(prev => prev + 1);
        lastTime = now;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, trailId]);

  // Container variants with aqua/water theme
  const containerVariants = {
    initial: { 
      boxShadow: "0 0 20px rgba(56, 189, 248, 0.35)", 
      borderColor: "rgba(56, 189, 248, 0.5)",
      backgroundColor: "rgba(0, 0, 0, 0.4)" 
    },
    hover: { 
      boxShadow: "0 0 40px rgba(235, 0, 40, 0.6), 0 0 20px rgba(56, 189, 248, 0.4)", 
      borderColor: "rgba(255, 255, 255, 0.9)",
      backgroundColor: "rgba(10, 10, 10, 0.6)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-sans selection:bg-red-600 overflow-x-hidden">
      {/* ========== DYNAMIC BACKGROUND ========== */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Floating geometric shapes */}
        {shapes.map((shape) => (
          <motion.div
            key={shape.id}
            className={`absolute ${shape.color} transition-all duration-500`}
            style={{
              left: shape.x,
              top: shape.y,
              width: shape.size,
              height: shape.size,
              borderWidth: 2,
              borderRadius: shape.type === 'circle' ? '50%' : shape.type === 'square' ? '8px' : '0',
              transform: shape.type === 'rhombus' ? 'rotate(45deg)' : 'none',
              boxShadow: shape.glow ? `0 0 20px ${shape.color.includes('red') ? 'rgba(239, 68, 68, 0.6)' : 'rgba(255, 255, 255, 0.5)'}` : 'none',
              opacity: shape.glow ? 0.8 : 0.5
            }}
          />
        ))}
        
        {/* Cursor trail dots - now includes aqua */}
        {trails.map((trail) => (
          <motion.div
            key={trail.id}
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`absolute w-2 h-2 rounded-full ${trail.color}`}
            style={{ left: trail.x, top: trail.y }}
          />
        ))}
        
        {/* Smaller cursor-following glow - split red and aqua */}
        <motion.div
          style={{ x: smoothX, y: smoothY }}
          className="absolute h-[300px] w-[300px] rounded-full bg-red-600/20 blur-[80px]"
        />
        <motion.div
          style={{ 
            x: useSpring(mouseX, { damping: 40, stiffness: 150 }), 
            y: useSpring(mouseY, { damping: 40, stiffness: 150 })
          }}
          className="absolute h-[200px] w-[200px] rounded-full bg-sky-400/15 blur-[60px]"
        />
        
        
        
        {/* Floating lines */}
        <motion.div
          animate={{
            x: [-100, 100, -100],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
        />
        <motion.div
          animate={{
            x: [100, -100, 100],
            opacity: [0.1, 0.25, 0.1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
        
        {/* Ambient red orbs */}
        <motion.div
          animate={{
            x: [0, 150, -100, 0],
            y: [0, -180, 120, 0],
            scale: [1, 1.2, 0.9, 1],
            opacity: [0.15, 0.25, 0.18, 0.15]
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/3 h-[400px] w-[400px] rounded-full bg-red-600/15 blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -180, 120, 0],
            y: [0, 150, -100, 0],
            scale: [1, 1.3, 1, 1],
            opacity: [0.18, 0.3, 0.2, 0.18]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/3 left-1/4 h-[450px] w-[450px] rounded-full bg-red-700/12 blur-[110px]"
        />
        
        {/* NEW: Aqua orbs for water theme balance */}
        <motion.div
          animate={{
            x: [0, -200, 150, 0],
            y: [0, 200, -150, 0],
            scale: [1, 1.15, 1.1, 1],
            opacity: [0.12, 0.2, 0.16, 0.12]
          }}
          transition={{ duration: 100, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-2/3 right-1/4 h-[380px] w-[380px] rounded-full bg-sky-400/12 blur-[95px]"
        />
        
        {/* Dark depth layers */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 h-[350px] w-[350px] rounded-full bg-black/25 blur-[70px] -translate-x-1/2 -translate-y-1/2"
        />
        
        {/* Subtle white accent */}
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.08, 0.15, 0.08]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/4 left-1/2 h-[250px] w-[250px] rounded-full bg-white/10 blur-[80px]"
        />
        
        {/* Floating particles */}
        <motion.div
          animate={{ 
            y: [-40, 40, -40],
            x: [-20, 20, -20],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/3 h-3 w-3 rounded-full bg-red-500/60 blur-sm"
        />
        <motion.div
          animate={{ 
            y: [50, -50, 50],
            x: [25, -25, 25],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute top-2/3 right-1/4 h-2 w-2 rounded-full bg-white/50 blur-sm"
        />
        <motion.div
          animate={{ 
            y: [-30, 30, -30],
            opacity: [0.35, 0.65, 0.35]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          className="absolute bottom-1/3 left-2/3 h-3 w-3 rounded-full bg-red-400/55 blur-sm"
        />
        <motion.div
          animate={{ 
            x: [-35, 35, -35],
            y: [25, -25, 25],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-1/4 right-1/3 h-2 w-2 rounded-full bg-white/45 blur-sm"
        />
      </div>

      {/* ========== MAIN CONTENT (AQUA/WATER INTEGRATED) ========== */}
      <main className="relative z-10 flex flex-col items-center">
        
        {/* ========== SECTION 1: HERO ========== */}
        <section className="h-[80vh] flex flex-col items-center justify-center text-center px-4">
          {/* NEW: Aqua shimmer overlay for hero */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            animate={{
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.2) 0%, transparent 70%)',
              mixBlendMode: 'screen'
            }}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl md:text-7xl font-black tracking-tighter mb-2"
            >
              ABOUT
            </motion.h1>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-3xl font-bold tracking-tight"
            >
              <span className="text-[#eb0028]">TEDx</span>
              <span className="ml-1 text-white">NIITUniversity</span>
            </motion.h2>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
              className="h-1 bg-[#eb0028] mt-4"
            />
          </motion.div>
        </section>

        {/* ========== SECTION 2: ABOUT TED (GLOBAL) ========== */}
        <section className="w-full max-w-4xl mx-auto px-8 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.h2 
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.6em" }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-gray-500 uppercase tracking-[0.6em] text-xs font-semibold mb-6"
            >
              ABOUT TED
            </motion.h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-12 rounded-3xl border border-white/15 backdrop-blur-md cursor-default mx-auto"
            style={{
              boxShadow: "0 0 15px rgba(255, 255, 255, 0.1)",
              backgroundColor: "rgba(0, 0, 0, 0.3)"
            }}
          >
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-gray-300 text-lg leading-relaxed text-center"
            >
              TED is a nonprofit devoted to spreading ideas worth spreading. Started as a conference in 1984, 
              TED has grown into a global community celebrating human curiosity and the power of ideas to change attitudes, 
              lives and ultimately, the world.
            </motion.p>
          </motion.div>
        </section>

        {/* ========== SECTION 3: ABOUT TEDxNIITUniversity ========== */}
        <section className="w-full max-w-4xl mx-auto px-8 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.h2 
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.6em" }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-gray-500 uppercase tracking-[0.6em] text-xs font-semibold mb-6"
            >
              ABOUT TEDxNIITUNIVERSITY
            </motion.h2>
          </motion.div>

          {/* INTERACTIVE DESCRIPTION CONTAINER - AQUA GLOW */}
          <motion.div 
            variants={containerVariants}
            initial="initial"
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover="hover"
            transition={{ duration: 0.6 }}
            className="p-12 rounded-3xl border backdrop-blur-md cursor-default mx-auto opacity-0 translate-y-10"
          >
            <motion.h4 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl font-bold mb-6 text-sky-400 text-center"
            >
              Our Mission
            </motion.h4>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-gray-300 text-lg leading-relaxed text-center"
            >
              TEDxNIITUniversity is a platform where ideas worth spreading come to life. 
              We bring together innovators, thinkers, and dreamers from diverse backgrounds 
              to share insights that inspire change and spark conversations. Through the 
              spirit of TED's mission, we aim to foster a community that celebrates 
              curiosity, creativity, and the power of human connection.
            </motion.p>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "60%" }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent mt-8 mx-auto"
            />
          </motion.div>
        </section>

        {/* ========== SECTION 4: THEME REVEAL ========== */}
        <section className="w-full max-w-6xl mx-auto px-8 pb-24 md:px-24">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.6 }}
              className="text-gray-500 uppercase tracking-[0.6em] text-sm font-semibold mb-12"
            >
              THEME
            </motion.h2>
            
            {/* LOGO + SUBLIS STACK */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative inline-block"
            >
              {/* WATER DROPLET LOGO - CENTRAL FLOATING */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                animate={{ y: [0, -15, 0] }}
                whileHover={{ scale: 1.08 }}
                transition={{ 
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 0.3 }
                }}
                className="flex justify-center mb-8 relative"
              >
                {/* Ripple effect behind logo */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-sky-400/50 -m-8"
                />
                
                {/* Aqua glow backdrop */}
                <motion.div
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -inset-12 bg-sky-400/20 blur-[60px] rounded-full"
                />
                
                {/* Logo Image */}
                <motion.div
                  className="relative z-10 w-48 h-48 md:w-56 md:h-56"
                  whileHover={{ 
                    filter: "drop-shadow(0 0 30px rgba(56, 189, 248, 0.8))"
                  }}
                >
                  <Image
                    src="/TEDx LOGO (NO BG).png"
                    alt="SUBLIS Water Droplet Logo"
                    width={224}
                    height={224}
                    priority
                    className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]"
                  />
                </motion.div>
              </motion.div>
              
              {/* SUBLIS TEXT - GLOWING GRADIENT */}
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                className="text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-sky-300 to-white py-2 mt-6 drop-shadow-lg"
                style={{
                  backgroundSize: '200% auto',
                  animation: 'gradient-x 4s linear infinite'
                }}
              >
                SUBLIS
              </motion.h2>
              
              {/* Glow aura under SUBLIS */}
              <motion.div 
                animate={{ opacity: [0.9, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-40 bg-sky-400/20 blur-3xl -z-10"
              />
            </motion.div>
          </div>

          {/* ========== SECTION 5: THEME EXPLANATION ========== */}
          <div className="flex flex-col md:flex-row gap-12 items-stretch mt-20">
            
            {/* LEFT: EMOTIONAL TEXT */}
            <motion.div 
              variants={containerVariants}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover="hover"
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 p-10 rounded-3xl border backdrop-blur-md cursor-default relative overflow-hidden"
            >
              {/* Waterline animation background */}
              <motion.div
                animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 opacity-20 -z-10 pointer-events-none"
                style={{
                  backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.1) 25%, transparent 50%, rgba(56, 189, 248, 0.1) 75%, transparent 100%)',
                  backgroundSize: '200% 100%'
                }}
              />
              
              <motion.h4 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-sky-300 to-sky-200 bg-clip-text text-transparent"
              >
                The Vision
              </motion.h4>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-gray-300 text-lg leading-relaxed mb-6"
              >
                <span className="text-sky-300 font-semibold">SUBLIS</span> represents the confluence of ideas and innovation—
                where great minds converge like water molecules finding harmony. It symbolizes the fluidity of thought, 
                the ripple effect of inspiration, and the profound impact of shared wisdom. In a water droplet lies 
                infinite possibility: reflection, refraction, and transformation. This is our commitment: to create a space 
                where every idea matters, every voice resonates, and together we shape the future.
              </motion.p>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "40%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="h-1 bg-gradient-to-r from-sky-400 to-transparent"
              />
            </motion.div>

            {/* RIGHT: GLASSY LOGO CARD */}
            <motion.div 
              variants={containerVariants}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover="hover"
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex-1 p-10 rounded-3xl border backdrop-blur-xl cursor-default flex flex-col items-center justify-center group relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                borderColor: 'rgba(56, 189, 248, 0.6)'
              }}
            >
              {/* Animated waterline effect inside card */}
              <motion.div
                animate={{ 
                  clipPath: ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)', 'inset(100% 0% 0% 0%)']
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-t from-sky-400/10 to-transparent pointer-events-none"
              />
              
               {/* Logo Container */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                className="relative group z-10 mb-6"
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5
                }}
              >
                <motion.div
                 
                >
                  <Image
                    src="/TEDx LOGO (NO BG).png"
                    alt="SUBLIS Theme Logo"
                    width={240}
                    height={240}
                    className="w-full h-full drop-shadow-[0_0_25px_rgba(56,189,248,0.6)]"
                  />
                </motion.div>
                
                {/* Rotating ring decorative */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, linear: true }}
                  className="absolute -inset-0 border-4 border-dashed border-sky-300/40 rounded-full"
                />
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-[11px] uppercase tracking-[0.3em] text-sky-300 font-semibold text-center relative z-10"
              >
                SUBLIS
              </motion.p>
            </motion.div>
          </div>
        </section>

      </main>


      <style jsx global>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 4s linear infinite;
        }
      `}</style>
    </div>
  );
}