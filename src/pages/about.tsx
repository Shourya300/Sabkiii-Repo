import React, { useEffect, useState } from 'react';
import Head from 'next/head';
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
      // 3 small circles (fast)
      { type: 'circle' as const, size: 80, speed: 2.0 },
      { type: 'circle' as const, size: 90, speed: 1.8 },
      { type: 'circle' as const, size: 85, speed: 2.2 },
      // 1 big circle (slow)
      { type: 'circle' as const, size: 200, speed: 0.5 },
      // 2 medium squares (medium speed)
      { type: 'square' as const, size: 130, speed: 1.2 },
      { type: 'square' as const, size: 140, speed: 1.0 },
      // 3 small rhombus (fast)
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

          // Bounce off walls
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

        // Check collisions between shapes
        for (let i = 0; i < newShapes.length; i++) {
          for (let j = i + 1; j < newShapes.length; j++) {
            const dx = newShapes[i].x - newShapes[j].x;
            const dy = newShapes[i].y - newShapes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = (newShapes[i].size + newShapes[j].size) / 2 + 30;

            if (distance < minDistance) {
              // Bounce away from each other
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
      setShapes(prev => prev.map(shape => ({
        ...shape,
        glow: Math.random() > 0.7
      })));
    }, 2000);

    return () => clearInterval(glowInterval);
  }, []);

  useEffect(() => {
    let lastTime = Date.now();
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 150);
      mouseY.set(e.clientY - 150);
      
      // Add trail dots at intervals
      const now = Date.now();
      if (now - lastTime > 50) {
        const newTrail: Trail = {
          id: trailId,
          x: e.clientX,
          y: e.clientY,
          color: Math.random() > 0.5 ? 'bg-red-500' : 'bg-white'
        };
        setTrails(prev => [...prev.slice(-20), newTrail]);
        setTrailId(prev => prev + 1);
        lastTime = now;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, trailId]);

  const containerVariants = {
    initial: { 
      boxShadow: "0 0 15px rgba(56, 189, 248, 0.2)", 
      borderColor: "rgba(56, 189, 248, 0.3)",
      backgroundColor: "rgba(0, 0, 0, 0.4)" 
    },
    hover: { 
      boxShadow: "0 0 35px rgba(235, 0, 40, 0.5)", 
      borderColor: "rgba(255, 255, 255, 0.9)",
      backgroundColor: "rgba(10, 10, 10, 0.6)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-sans selection:bg-red-600 overflow-x-hidden">
      <Head>
        <title>About | TEDxNIITUniversity</title>
      </Head>

      {/* DYNAMIC BACKGROUND */}
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
        
        {/* Cursor trail dots */}
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
        
        {/* Smaller cursor-following glow */}
        <motion.div
          style={{ x: smoothX, y: smoothY }}
          className="absolute h-[300px] w-[300px] rounded-full bg-red-600/20 blur-[80px]"
        />
        <motion.div
          style={{ 
            x: useSpring(mouseX, { damping: 40, stiffness: 150 }), 
            y: useSpring(mouseY, { damping: 40, stiffness: 150 })
          }}
          className="absolute h-[200px] w-[200px] rounded-full bg-white/10 blur-[60px]"
        />
        
        {/* Animated gradient mesh background */}
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(220, 38, 38, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 40%)',
            backgroundSize: '200% 200%'
          }}
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

      <main className="relative z-10 flex flex-col items-center">
        {/* HERO SECTION - RESTORED BRANDING */}
        <section className="h-[80vh] flex flex-col items-center justify-center text-center px-4">
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

        {/* TEDxNIITUniversity DESCRIPTION SECTION */}
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
              ABOUT TEDxNIITUniversity
            </motion.h2>
          </motion.div>

          {/* INTERACTIVE DESCRIPTION CONTAINER */}
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

        {/* THEME SECTION */}
        <section className="w-full max-w-6xl mx-auto px-24 pb-32">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.6 }}
              className="text-gray-500 uppercase tracking-[0.6em] text-lg font-semibold mb-8"
            >
              THEME
            </motion.h2>
            
            {/* SUBLIS GLOWING REVEAL */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative inline-block"
            >
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                className="text-7xl md:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-sky-400 to-white bg-[length:200%_auto] animate-gradient-x py-2"
              >
                SUBLIS
              </motion.h2>
              <motion.div 
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute inset-0 blur-2xl bg-sky-400/20 -z-10"
              />
            </motion.div>
          </div>

          {/* INTERACTIVE CONTAINERS */}
          <div className="flex flex-col md:flex-row gap-8 items-stretch mt-16">
            
            {/* DESCRIPTION CONTAINER */}
            <motion.div 
              variants={containerVariants}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover="hover"
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-[2] p-10 rounded-3xl border backdrop-blur-md cursor-default"
            >
              <motion.h4 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-2xl font-bold mb-6 text-sky-400"
              >
                The Vision
              </motion.h4>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-gray-300 text-lg leading-relaxed"
              >
                Add your theme description here. This space is designed to explain the 
                core philosophy behind SUBLIS. The container glows blue by default 
                and reacts with a sharp white/red shift when you explore it.
              </motion.p>
            </motion.div>

            {/* LOGO CONTAINER */}
            <motion.div 
              variants={containerVariants}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover="hover"
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex-1 p-10 rounded-3xl border backdrop-blur-md flex flex-col items-center justify-center cursor-default"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                className="relative group"
              >
                {/* Placeholder for your actual Logo */}
                <div className="w-40 h-40 bg-white/10 rounded-full flex items-center justify-center border border-white/20 overflow-hidden">
                   <span className="text-gray-500 font-bold">LOGO</span>
                </div>
                {/* Decorative ring */}
                <div className="absolute -inset-2 border border-dashed border-sky-400/30 rounded-full animate-[spin_20s_linear_infinite]" />
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-8 text-[10px] uppercase tracking-[0.3em] text-gray-400 font-medium"
              >
                Official Theme Identity
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