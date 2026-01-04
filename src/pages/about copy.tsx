import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div ref={containerRef} className="bg-black text-white min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-red-600/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-[400px] h-[400px] bg-red-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            x: [0, 40, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-300/50 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              className="text-7xl md:text-9xl font-bold mb-6 bg-gradient-to-r from-red-500 via-red-600 to-blue-400 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              TEDx<span className="text-white">NIIT</span>
            </motion.h1>
            <motion.h2
              className="text-4xl md:text-6xl font-semibold mb-8 text-blue-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              University
            </motion.h2>
            <motion.p
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              Ideas Worth Spreading
            </motion.p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-red-500 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-2 bg-red-500 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Content Container 1 - Mission/Vision */}
      <section className="relative z-10 py-32 px-4">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="relative h-[400px] bg-gradient-to-br from-red-600/10 via-black/50 to-blue-400/10 backdrop-blur-sm border border-red-500/20 rounded-2xl p-8 flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              style={{ y: y1 }}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-3xl font-bold text-red-500 mb-4">Our Mission</h3>
                <p className="text-gray-400">Content placeholder - Add your mission text here</p>
              </div>
            </motion.div>

            <motion.div
              className="relative h-[400px] bg-gradient-to-br from-blue-400/10 via-black/50 to-red-600/10 backdrop-blur-sm border border-blue-400/20 rounded-2xl p-8 flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              style={{ y: y2 }}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">👁️</div>
                <h3 className="text-3xl font-bold text-blue-400 mb-4">Our Vision</h3>
                <p className="text-gray-400">Content placeholder - Add your vision text here</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Content Container 2 - About TEDx */}
      <section className="relative z-10 py-32 px-4">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="relative bg-gradient-to-br from-red-900/20 via-black/60 to-blue-900/20 backdrop-blur-lg border border-red-500/30 rounded-3xl p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <motion.h2
                className="text-5xl md:text-6xl font-bold mb-8 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                About <span className="text-red-500">TEDx</span>
              </motion.h2>
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-700 rounded-xl">
                <p className="text-gray-500 text-lg">Image/Content Placeholder - Add TEDx description here</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Content Container 3 - Stats/Achievements */}
      <section className="relative z-10 py-32 px-4">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold text-center mb-16">
            Our <span className="text-blue-400">Impact</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                className="relative h-[300px] bg-gradient-to-br from-black/80 via-red-900/20 to-blue-900/20 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center"
                whileHover={{
                  scale: 1.05,
                  borderColor: "rgba(239, 68, 68, 0.5)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-5xl font-bold text-red-500 mb-4">000</div>
                <h3 className="text-xl font-semibold mb-2 text-blue-200">Stat Title {item}</h3>
                <p className="text-gray-400 text-center text-sm">Add your achievement stats here</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Content Container 4 - Team Section */}
      <section className="relative z-10 py-32 px-4">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-16">
            Meet Our <span className="text-red-500">Team</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <motion.div
                key={item}
                className="relative h-[350px] bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden group"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="h-3/4 flex items-center justify-center border-b border-gray-800">
                  <div className="text-gray-600 text-4xl">👤</div>
                </div>
                <div className="h-1/4 p-4 flex flex-col items-center justify-center">
                  <p className="text-sm font-semibold text-blue-200">Member {item}</p>
                  <p className="text-xs text-gray-500">Position</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Content Container 5 - Call to Action */}
      <section className="relative z-10 py-32 px-4">
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="relative bg-gradient-to-r from-red-600/20 via-black/60 to-blue-500/20 backdrop-blur-lg border-2 border-red-500/50 rounded-3xl p-16 text-center overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-blue-500/10"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <div className="relative z-10">
              <h2 className="text-5xl font-bold mb-6">
                Join Our <span className="text-red-500">Journey</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Content placeholder - Add your call to action text here
              </p>
              <motion.button
                className="px-12 py-4 bg-red-600 hover:bg-red-700 rounded-full text-lg font-semibold transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Involved
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer Spacer */}
      <div className="h-32" />
    </div>
  );
};

export default About;
