import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ComputersScene from "@/components/ComputersScene";

export default function SponsorshipPage() {
  const sponsors = [
    { name: "TechVision", image: "/nsponsor/generated/logo_v2_1.png" },
    { name: "DataFlow", image: "/nsponsor/generated/logo_v2_2.png" },
    { name: "CloudSync", image: "/nsponsor/generated/logo_v2_3.png" },
    { name: "AI Nexus", image: "/nsponsor/generated/logo_v2_4.png" },
    { name: "SecureGuard", image: "/nsponsor/generated/logo_v2_5.png" },
    { name: "DataMetrics", image: "/nsponsor/generated/logo_v2_6.png" },
    { name: "MobileFirst", image: "/nsponsor/generated/logo_v2_7.png" },
    { name: "FinFlow", image: "/nsponsor/generated/logo_v2_1.png" }, // Reusing v2_1 due to quota
    { name: "CloudWorks", image: "/nsponsor/generated/logo_v2_2.png" }, // Reusing v2_2 due to quota
  ];

  const marqueeSponsors = [...sponsors, ...sponsors, ...sponsors, ...sponsors];

  return (
    <main className="relative min-h-screen w-full text-white font-sans selection:bg-[#B52D2D] selection:text-white overflow-x-hidden">

      {/* 3D BACKGROUND SCENE */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-auto">
        <ComputersScene sponsors={sponsors} />
      </div>

      {/* 
        HERO SECTION 
      */}
      <section className="relative h-screen flex flex-col z-10">

        {/* Header */}
        {/* Header */}
        {/* Header */}
        <header className="flex justify-between items-center px-8 py-6 md:px-16 md:py-8 z-50">
          <div className="text-3xl font-black tracking-tighter text-[#E62B1E]">
            TEDx
          </div>

          <button className="group flex items-center gap-2 px-6 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-all text-sm font-medium tracking-wide backdrop-blur-sm">
            TICKETS
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </header>

        {/* Hero Content - Reverted to Centered/Left Layout without Spline */}
        <div className="flex-grow flex flex-row items-center justify-between px-8 md:px-16 max-w-7xl mx-auto w-full pb-32 relative">

          <div className="max-w-3xl z-10">
            {/* Header Text removed as per request */}
          </div>

          {/* 3D Scene handles the visuals now, removing Neon X */}
        </div>

        {/* Bottom Ribbon (Marquee) */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-black/30 backdrop-blur-sm border-t border-white/5 flex items-center overflow-hidden z-20">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />

          <div className="flex overflow-hidden w-full">
            <motion.div
              className="flex items-center gap-16 px-8 whitespace-nowrap"
              initial={{ x: "-50%" }}
              animate={{ x: "0%" }}
              key="slow-marquee" // Force re-render to apply new duration
              transition={{ repeat: Infinity, ease: "linear", duration: 120 }} // Duration is in seconds. Higher = Slower.
            >
              {marqueeSponsors.map((sponsor, idx) => (
                <div key={idx} className="flex items-center gap-4 group opacity-50 hover:opacity-100 transition-all duration-300 cursor-pointer">
                  <div className="relative w-8 h-8 shrink-0">
                    <Image
                      src={sponsor.image}
                      alt={sponsor.name}
                      fill
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                  <span className="text-lg font-bold text-white tracking-wide">{sponsor.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 
      SPONSOR GRID SECTION 
    */}
      <section className="relative px-8 py-32 md:px-16 z-10 bg-gradient-to-b from-black to-[#240605]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <p className="text-white/40 text-lg mb-4">Trusted by the best</p>
            <h3 className="text-3xl md:text-5xl font-bold">Our Esteemed Partners</h3>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
            {sponsors.map((sponsor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, filter: "brightness(1.2)" }}
                className="group flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all cursor-pointer aspect-[4/3]"
              >
                <div className="relative w-full h-full p-4">
                  <Image
                    src={sponsor.image}
                    alt={sponsor.name}
                    fill
                    className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-sm text-white/50">
                  {sponsor.name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
