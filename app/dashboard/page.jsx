"use client";

import { useState,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dumbbell, Utensils, ArrowLeft, Flame, Calendar, Clock, 
  ChevronRight, Sparkles, ShoppingBag, CheckCircle, BrainCircuit,
  Droplet, ListChecks, Pill, ChefHat, Activity, ShieldCheck, Apple
} from "lucide-react";
import { getFCMToken } from "@/lib/firebaseMessaging";
import { initializeForegroundNotifications } from "@/lib/notificationListener";
import WorkoutPage from "../components/workoutlist";
export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [diets, setDiets] = useState([]);
  const [selected, setSelected] = useState("diet"); // Defaulted to diet for quick preview
  const [selectedDiet, setSelectedDiet] = useState(null);
  const [expandedMeal, setExpandedMeal] = useState(null);

  const getDiets = async () => {
    setLoading(true);
    try {
      const member = JSON.parse(localStorage.getItem("member"));
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/diets/member-diets`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gymid: "9UBpgesDzQP7xfzV9kBO",
            userid: member?.userid || "",
            password: member?.password || "",
          }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setDiets(data.diets);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const currentDiet = selectedDiet !== null ? diets[selectedDiet]?.diet : null;
const enableNotifications = async () => {
  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    alert("Notification permission denied");
    return;
  }

  const token = await getFCMToken();

if (!token) {
  alert("Unable to get notification token");
  return;
}

const member = JSON.parse(localStorage.getItem("member"));

await fetch(
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications/register-token`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      gymid: "9UBpgesDzQP7xfzV9kBO",
      userid: member.userid,
      password: member.password,
      fcmtoken: token,
    }),
  }
);

alert("Notifications Enabled 🎉");
};
useEffect(() => {
  initializeForegroundNotifications();
}, []);
  return (
    <div className="min-h-screen bg-neutral-950 text-white relative font-sans overflow-x-hidden selection:bg-red-500 selection:text-white pb-12">
      {/* Cyber Tech Ambient Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />
      <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-red-600/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-1/4 h-[400px] w-[400px] rounded-full bg-orange-600/5 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Futuristic Top Control Center */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">RoboCoach Bio-Telemetry v4.5</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
              Member Dashboard
            </h1>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                setSelected("diet");
                setSelectedDiet(null);
                getDiets();
              }}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all ${
                selected === "diet" 
                  ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-xl shadow-red-900/20 scale-[1.02]" 
                  : "bg-neutral-900 border border-white/5 hover:border-red-500/30 text-gray-400 hover:text-white"
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Diet Engine</span>
            </button>

            <button
              onClick={() => setSelected("workout")}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all ${
                selected === "workout" 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-900/20 scale-[1.02]" 
                  : "bg-neutral-900 border border-white/5 hover:border-blue-500/30 text-gray-400 hover:text-white"
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>AI Workout Plans</span>
            </button>
          </div>
        </header>

        {/* Loading Matrix State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 font-mono text-xs tracking-widest uppercase animate-pulse">Syncing Nutritional Matrix...</p>
          </div>
        )}

        {/* DIET GRID LEVEL VIEW */}
        {selected === "diet" && !loading && selectedDiet === null && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-200">
                Optimized Nutritional Blueprints
              </h2>
              <span className="text-xs px-3 py-1 bg-neutral-900 border border-white/10 text-gray-400 font-mono rounded-full">
                {diets.length} Available
              </span>
            </div>

            {diets.length === 0 ? (
              <div className="text-center py-16 bg-neutral-900/40 border border-white/5 rounded-3xl p-8 max-w-md mx-auto">
                <Apple className="w-12 h-12 text-red-500 mx-auto mb-4 opacity-40 animate-bounce" />
                <h3 className="text-lg font-bold mb-2">No Active Diet Engine Plans</h3>
                <p className="text-sm text-gray-400 mb-6">Fetch your personalized macro allocations directly from your coach database.</p>
                <button onClick={getDiets} className="bg-red-600 hover:bg-red-700 font-semibold px-6 py-3 rounded-xl text-sm transition-all">
                  Initialize Sync
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {diets.map((diet, index) => (
                  <motion.div
                    whileHover={{ y: -5 }}
                    key={diet.diet_docid || index}
                    onClick={() => { setSelectedDiet(index); setExpandedMeal(null); }}
                    className="cursor-pointer group relative rounded-2xl bg-neutral-900/30 border border-white/5 backdrop-blur-md p-6 hover:border-red-500/40 transition-all flex flex-col justify-between min-h-[13rem] overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-3xl rounded-full group-hover:bg-red-600/10 transition-colors" />
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono text-red-400 font-bold tracking-widest uppercase bg-red-500/10 border border-red-500/10 px-2.5 py-1 rounded-md">
                          Architecture Plan 0{index + 1}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">ID: {diet.diet_docid?.substring(0, 5)}...</span>
                      </div>
                      <h3 className="text-2xl font-black mt-4 tracking-tight group-hover:text-red-400 transition-colors">
                        {diet.diet?.planName || "Vegetarian Matrix"}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-orange-500" />
                        Target Vector: <span className="text-white font-medium">{diet.diet?.goal}</span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6 text-xs text-gray-400 font-medium">
                      <span>Macro Allocations Loaded</span>
                      <span className="flex items-center gap-1 text-red-400 bg-red-500/5 border border-red-400/10 px-2.5 py-1 rounded-lg">
                        {diet.diet?.meals?.length || 0} Scheduled Meals
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* DIET DEEP DIVE DRILL DOWN SCREEN */}
        {selected === "diet" && !loading && selectedDiet !== null && currentDiet && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            
            {/* Context Back Ribbon */}
            <button
              onClick={() => setSelectedDiet(null)}
              className="group flex items-center gap-2 bg-neutral-900 border border-white/10 hover:border-white/20 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Core Engine Matrices</span>
            </button>

            {/* Macro Header Dashboard Deck */}
            <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-red-600/10 to-orange-600/0 blur-3xl rounded-full" />
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-red-400 tracking-wider uppercase mb-1">
                    <BrainCircuit className="w-4 h-4 text-red-500 animate-pulse" />
                    <span>RoboCoach High-Performance Plan</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight">{currentDiet.planName}</h2>
                  <p className="text-gray-400 text-sm mt-1">Caloric Target Engine Objective: <span className="text-white font-medium">{currentDiet.goal}</span></p>
                </div>
              </div>

              {/* Advanced Dashboard Macro Grid Blocks */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {[
                  { label: "Daily Energy Target", val: `${currentDiet.summary?.dailyCalories} kcal`, desc: "Total Energy Stream", icon: Flame, color: "text-orange-400 bg-orange-500/5" },
                  { label: "Anabolic Protein", val: `${currentDiet.summary?.protein}g`, desc: "Muscle Tissue Growth", icon: Dumbbell, color: "text-red-400 bg-red-500/5" },
                  { label: "Glycogen Carbs", val: `${currentDiet.summary?.carbs}g`, desc: "High Energy Reserve", icon: Sparkles, color: "text-blue-400 bg-blue-500/5" },
                  { label: "Lipids / Fats", val: `${currentDiet.summary?.fats}g`, desc: "Hormone Regulation", icon: ShieldCheck, color: "text-yellow-400 bg-yellow-500/5" },
                  { label: "Water Volumizer", val: `${currentDiet.summary?.waterLiters} Liters`, desc: "Hydration Intake", icon: Droplet, color: "text-cyan-400 bg-cyan-500/5" }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-neutral-950/40 border border-white/5 p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-[10px] font-mono tracking-wide text-gray-400 uppercase leading-none">{stat.label}</span>
                      <stat.icon className={`w-4 h-4 ${stat.color} p-0.5 rounded`} />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-black tracking-tight text-white mb-0.5">{stat.val}</div>
                      <span className="text-[10px] text-gray-500 font-light block leading-none">{stat.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Dynamic Component Split Layout (Left: Meals Layout, Right: Meta Parameters) */}
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              
              {/* MEALS LIST TIER LAYOUT PANEL (Takes 2 Columns) */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xl font-black text-gray-200 tracking-tight flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-red-500" />
                  <span>Daily Meal Distribution Matrix</span>
                </h3>

                {currentDiet.meals?.map((meal, idx) => {
                  const isExpanded = expandedMeal === idx;
                  return (
                    <div 
                      key={idx}
                      className="bg-neutral-900/20 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md transition-all hover:border-white/10"
                    >
                      {/* Summary Interactive Parent Row */}
                      <div 
                        onClick={() => setExpandedMeal(isExpanded ? null : idx)}
                        className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-red-500/10 text-red-400 rounded-xl font-mono text-xs font-bold mt-0.5 flex-shrink-0">
                            0{idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-lg font-black tracking-tight text-white group-hover:text-red-400 transition-colors">{meal.mealName}</h4>
                              <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-800 text-gray-400 rounded flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {meal.time}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm mt-1 font-medium">{meal.recipe?.title}</p>
                          </div>
                        </div>

                        {/* Macro Tags Minimalist Blueprint */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                          <div className="grid grid-cols-2 sm:flex sm:flex-row gap-x-4 gap-y-1 text-xs font-mono text-gray-400">
                            <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-400" /> {meal.calories} kcal</span>
                            <span className="flex items-center gap-1"><Dumbbell className="w-3.5 h-3.5 text-red-400" /> {meal.protein}g P</span>
                            <span className="flex items-center gap-1 hidden sm:flex"><Sparkles className="w-3.5 h-3.5 text-blue-400" /> {meal.carbs}g C</span>
                            <span className="flex items-center gap-1 hidden sm:flex"><ShieldCheck className="w-3.5 h-3.5 text-yellow-400" /> {meal.fats}g F</span>
                          </div>
                          <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            className="text-gray-500 group-hover:text-white"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </motion.div>
                        </div>
                      </div>

                      {/* Deep-Dive Expandable Accordion Menu Content */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-white/5 bg-neutral-900/30"
                          >
                            <div className="p-5 sm:p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                              
                              {/* Left Recipe Diagnostics Matrix */}
                              <div className="space-y-4">
                                <h5 className="text-xs font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">// Recipe Telemetry</h5>
                                <div className="bg-neutral-950/60 border border-white/5 rounded-xl p-4 space-y-2.5 font-mono text-xs text-gray-300">
                                  <div className="flex justify-between"><span>Prep Time:</span><span className="text-white">{meal.recipe?.prepTime}</span></div>
                                  <div className="flex justify-between"><span>Difficulty Level:</span><span className="text-red-400 font-bold">{meal.recipe?.difficulty}</span></div>
                                  <div className="flex justify-between sm:hidden"><span>Carbs:</span><span className="text-blue-400">{meal.carbs}g</span></div>
                                  <div className="flex justify-between sm:hidden"><span>Fats:</span><span className="text-yellow-400">{meal.fats}g</span></div>
                                </div>

                                <h5 className="text-xs font-mono text-gray-400 uppercase tracking-widest pt-2 flex items-center gap-1.5"><Apple className="w-3.5 h-3.5 text-green-400" /> Key Food Types</h5>
                                <div className="flex flex-wrap gap-1.5">
                                  {meal.foods?.map((food, fIdx) => (
                                    <span key={fIdx} className="text-[11px] font-mono capitalize px-2.5 py-1 bg-neutral-950 text-gray-400 border border-white/5 rounded-md">
                                      {food}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Center Ingredients Mass Dosage */}
                              <div>
                                <h5 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><ListChecks className="w-3.5 h-3.5 text-orange-400" /> Mass Ingredients</h5>
                                <div className="bg-neutral-950/40 border border-white/5 rounded-xl p-4 space-y-2.5">
                                  {meal.recipe?.ingredients?.map((ing, iIdx) => (
                                    <div key={iIdx} className="flex items-center gap-2 text-xs text-gray-300">
                                      <div className="w-1.5 h-1.5 border border-red-500/50 rounded-sm transform rotate-45 flex-shrink-0" />
                                      <span>{ing}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Right Multi-Step Algorithmic Preparation Rules */}
                              <div className="md:col-span-2 lg:col-span-1 space-y-2">
                                <h5 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><ChefHat className="w-3.5 h-3.5 text-blue-400" /> Prep Directives</h5>
                                <ol className="space-y-3 max-h-[16rem] overflow-y-auto pr-1">
                                  {meal.recipe?.steps?.map((step, sIdx) => (
                                    <li key={sIdx} className="flex gap-2 text-xs text-gray-300 leading-relaxed">
                                      <span className="font-mono text-[10px] text-red-400 font-bold bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/10 h-fit flex-shrink-0">
                                        0{sIdx + 1}
                                      </span>
                                      <span>{step}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* SIDEBAR COLUMNS: SHOPPING LISTS & METRICS (Takes 1 Column) */}
              <div className="space-y-6">
                
                {/* 1. SHOPPING LIST INVENTORY PANEL */}
                <div className="bg-neutral-900/30 border border-white/5 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingBag className="w-4 h-4 text-orange-400" />
                    <h4 className="font-black text-md text-white tracking-tight">AI Shopping List Depot</h4>
                  </div>
                  <div className="space-y-1.5 max-h-[16rem] overflow-y-auto pr-1">
                    {currentDiet.shoppingList?.map((item, idx) => (
                      <label 
                        key={idx} 
                        className="flex items-center gap-3 bg-neutral-950/50 border border-white/5 p-3 rounded-xl font-mono text-xs text-gray-300 capitalize hover:border-red-500/20 cursor-pointer transition-colors"
                      >
                        <input type="checkbox" className="accent-red-600 rounded border-white/20 bg-neutral-900 w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 2. NEURO SUPPLEMENTS REGIMEN */}
                <div className="bg-neutral-900/30 border border-white/5 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-3">
                    <Pill className="w-4 h-4 text-blue-400" />
                    <h4 className="font-black text-md text-white tracking-tight">Anabolic Supplements</h4>
                  </div>
                  <p className="text-gray-500 text-[11px] font-light leading-relaxed mb-4">
                    Recommended catalytic enhancers to maximize post-workout nitrogen retention.
                  </p>
                  <div className="space-y-2">
                    {currentDiet.supplements?.map((supp, sIdx) => (
                      <div key={sIdx} className="bg-neutral-950 p-3 rounded-xl border border-white/5 text-xs font-mono font-bold uppercase tracking-wider text-gray-200 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span>{supp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. ROBOCOACH ALGORITHMIC COACHING ADVISORIES */}
                <div className="bg-neutral-900/30 border border-white/5 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-4">
                    <BrainCircuit className="w-4 h-4 text-red-500" />
                    <h4 className="font-black text-md text-white tracking-tight">Neural Advisory Logs</h4>
                  </div>
                  <div className="space-y-3">
                    {currentDiet.tips?.map((tip, idx) => (
                      <div key={idx} className="flex gap-3 items-start text-xs leading-relaxed text-gray-300">
                        <CheckCircle className="w-3.5 h-3.5 text-red-500/70 mt-0.5 flex-shrink-0" />
                        <p>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Notification Interactive Push Button Deck */}
            <div className="flex justify-center pt-4">
              <button  onClick={enableNotifications} className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-10 py-4 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-emerald-950/30 transition-all hover:scale-[1.01]">
                🔔 Subscribe to Real-Time Meal Reminders
              </button>
            </div>

          </motion.div>
        )}

    {/* WORKOUT PAGE */}
{selected === "workout" && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full"
  >
    <WorkoutPage />
  </motion.div>
)}

      </div>
    </div>
  );
}