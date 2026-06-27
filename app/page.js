"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Lock, User, Dumbbell, Cpu, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter()
  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login-member`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gymid: "9UBpgesDzQP7xfzV9kBO",
            userid,
            password,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("member", JSON.stringify(data.member));
        setMessage("✅ Login Successful! Initializing RoboCoach...");
        router.push("/dashboard")
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Cyber-Link Failure: Server Error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden font-sans selection:bg-red-500 selection:text-white flex flex-col justify-between">
      
      {/* Dynamic Cyber Ambient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Neon Orbs */}
        <motion.div 
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 20, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-20 h-[350px] w-[350px] sm:h-[600px] sm:w-[600px] rounded-full bg-gradient-to-br from-red-600 to-purple-800 blur-[100px] sm:blur-[150px] opacity-25"
        />
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -20, 0],
            y: [0, 20, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-20 -right-20 h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-gradient-to-tr from-orange-500 to-red-600 blur-[100px] sm:blur-[160px] opacity-15"
        />
        
        {/* Tech Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:30px_30px] sm:bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_40%,#000_60%,transparent_100%)]" />
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center opacity-5 sm:opacity-10 mix-blend-luminosity" />
      </div>

      {/* Main Structural Layout Container */}
      <div className="relative z-10 flex flex-col lg:flex-row flex-1 container mx-auto px-4 sm:px-6 lg:px-8 gap-12 lg:gap-8 items-center lg:items-stretch py-8 sm:py-12 lg:py-16">
        
        {/* Left Side: Brand & AI Highlights */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-8 lg:space-y-0 lg:pr-12 text-center lg:text-left items-center lg:items-start">
          {/* Logo / Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 border border-white/10 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full w-fit"
          >
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              India's 1st AI RoboCoach Arena
            </span>
          </motion.div>

          {/* Main Hero Hook */}
          <div className="space-y-4 sm:space-y-6 my-auto w-full flex flex-col items-center lg:items-start">
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight leading-tight sm:leading-none w-full"
            >
              Evolutionize <br className="hidden sm:inline" />
              Your <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">Strength.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-sm sm:text-base md:text-lg max-w-md font-light leading-relaxed mx-auto lg:mx-0"
            >
              Step into a hyper-personalized ecosystem where computer vision and real-time biomechanics rewrite your limits.
            </motion.p>

            {/* Feature Pills */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 w-full max-w-lg text-left"
            >
              {[
                { icon: Cpu, label: "AI Form Tracking" },
                { icon: Dumbbell, label: "Adaptive Loading" },
                { icon: Zap, label: "Neuro-Response Maps" },
                { icon: ShieldCheck, label: "Zero-Injury Safety" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all hover:bg-white/[0.05] hover:border-red-500/30 group">
                  <div className="p-2 rounded-lg sm:rounded-xl bg-red-500/10 text-red-400 group-hover:scale-110 transition-transform flex-shrink-0">
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-300">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Desktop Only Copyright Info */}
          <p className="hidden lg:block text-xs text-gray-600 font-mono">
            // OPERATING ON NEURAL-NET V4.2 // © 2026 ROBOCOACH
          </p>
        </div>

        {/* Right Side: High-Tech Login Card Container */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="w-full max-w-md rounded-3xl sm:rounded-[2.5rem] border border-white/10 bg-neutral-900/40 backdrop-blur-3xl p-6 sm:p-8 xl:p-10 shadow-[0_0_50px_rgba(0,0,0,0.6)] relative group overflow-hidden"
          >
            {/* Cyber Corner Accents */}
            <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 border-red-500/30 rounded-tl-2xl sm:rounded-tl-3xl pointer-events-none group-hover:border-red-500 transition-colors" />
            <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 border-orange-500/30 rounded-br-2xl sm:rounded-br-3xl pointer-events-none group-hover:border-orange-500 transition-colors" />

            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                Secure Biometric Access
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm">
                Authenticate credentials to link your personalized profile.
              </p>
            </div>

            <form onSubmit={login} className="space-y-4 sm:space-y-5">
              {/* User ID Field */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[10px] sm:text-xs font-mono tracking-wider text-gray-400 uppercase">Member Identifier</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-colors group-focus-within:text-red-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g., ROBO-8829"
                    value={userid}
                    onChange={(e) => setUserid(e.target.value)}
                    className="w-full rounded-xl sm:rounded-2xl bg-neutral-950/60 border border-white/10 focus:border-red-500 px-10 sm:px-12 py-3.5 sm:py-4 text-sm sm:text-base text-white placeholder-gray-600 outline-none transition-all focus:shadow-[0_0_20px_rgba(239,68,68,0.12)]"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[10px] sm:text-xs font-mono tracking-wider text-gray-400 uppercase">Access Passkey</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl sm:rounded-2xl bg-neutral-950/60 border border-white/10 focus:border-red-500 px-10 sm:px-12 py-3.5 sm:py-4 text-sm sm:text-base text-white placeholder-gray-600 outline-none transition-all focus:shadow-[0_0_20px_rgba(239,68,68,0.12)]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full relative group/btn rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 p-3.5 sm:p-4 text-sm sm:text-md font-bold text-white transition-all hover:from-red-500 hover:to-orange-500 disabled:opacity-50 shadow-lg shadow-red-900/20 overflow-hidden flex items-center justify-center gap-2 mt-6 sm:mt-8"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Synchronizing...</span>
                  </div>
                ) : (
                  <>
                    <span>Initialize Session</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/btn:translate-x-1" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Animated Feedback Messages */}
            <AnimatePresence mode="wait">
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl border border-white/5 bg-white/[0.01] text-center text-xs sm:text-sm font-medium tracking-wide text-gray-200"
                >
                  {message}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Mobile & Tablet Only Footer Copyright */}
        <p className="block lg:hidden text-[10px] text-gray-600 font-mono text-center pt-4">
          // OPERATING ON NEURAL-NET V4.2 // © 2026 ROBOCOACH
        </p>
      </div>
    </div>
  );
}