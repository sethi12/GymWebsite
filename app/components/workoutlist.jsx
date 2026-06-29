"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dumbbell, Clock, ChevronRight, Sparkles, BrainCircuit,
  Flame, ShieldCheck, Activity, Target, Zap, Layers, Award
} from "lucide-react";

export default function WorkoutPage() {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [expandedExercise, setExpandedExercise] = useState(null);

  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  const fetchWorkoutPlans = async () => {
    try {
      const member = JSON.parse(localStorage.getItem("member"));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/workouts/member-workouts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gymid: "9UBpgesDzQP7xfzV9kBO",
            userid: member?.userid || "",
            password: member?.password || "",
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Based on your Firestore schema, data.workoutPlans is directly an array of plans
        setWorkoutPlans(data.workoutPlans || []);
        if (data.workoutPlans && data.workoutPlans.length > 0) {
          setSelectedPlan(0);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-24 bg-neutral-900/20 border border-white/5 rounded-3xl backdrop-blur-md max-w-lg mx-auto">
        <BrainCircuit className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
        <h3 className="text-xl font-black tracking-tight mb-2">
          Kinetic Trajectory Calibration
        </h3>
        <p className="text-gray-400 text-sm animate-pulse px-6">
          RoboCoach computer-vision movement tracking grids are computing performance data models. Neural maps loading shortly.
        </p>
      </div>
    );
  }

  if (workoutPlans.length === 0) {
    return (
      <div className="text-center py-16 bg-neutral-900/30 border border-white/5 rounded-3xl p-8 max-w-md mx-auto backdrop-blur-md">
        <Dumbbell className="w-12 h-12 text-blue-500 mx-auto mb-4 opacity-40" />
        <h3 className="text-lg font-bold mb-2">No Active Kinetic Blueprints</h3>
        <p className="text-sm text-gray-400 mb-6">
          Your personalized workout splits haven't been assigned or synced to this node yet.
        </p>
        <button onClick={fetchWorkoutPlans} className="bg-blue-600 hover:bg-blue-700 font-semibold px-6 py-3 rounded-xl text-sm transition-all">
          Retry Pipeline Sync
        </button>
      </div>
    );
  }

  // Exact node extraction matching your payload mapping
  const currentPlanNode = workoutPlans[selectedPlan];
  const currentDayNode = currentPlanNode?.weeklySchedule?.[activeDayIdx];

  return (
    <div className="space-y-8">
      {/* 1. MULTI-PLAN SELECTOR TABS (If you assign more than one track) */}
      {workoutPlans.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {workoutPlans.map((plan, pIdx) => (
            <button
              key={pIdx}
              onClick={() => {
                setSelectedPlan(pIdx);
                setActiveDayIdx(0);
                setExpandedExercise(null);
              }}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
                selectedPlan === pIdx
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/40 shadow-lg shadow-blue-950/20"
                  : "bg-neutral-900/60 text-gray-400 border-white/5 hover:border-white/15"
              }`}
            >
              🎯 PROTOCOL 0{pIdx + 1}: {plan.planName || "Active Track"}
            </button>
          ))}
        </div>
      )}

      {/* 2. CORE PERFORMANCE METRICS BANNER */}
      <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-600/10 to-purple-600/0 blur-3xl rounded-full" />
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 tracking-wider uppercase mb-1">
              <BrainCircuit className="w-4 h-4 text-blue-500 animate-pulse" />
              <span>RoboCoach High-Intensity Split</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              {currentPlanNode?.planName || "Hypertrophy Matrix"}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Target Adaptation Vector: <span className="text-white font-medium">{currentPlanNode?.goal || "Muscle Build"}</span>
            </p>
          </div>
          
          <div className="text-xs font-mono text-gray-400 bg-neutral-950/60 border border-white/5 px-4 py-2 rounded-xl h-fit">
            📅 Total Schedule Length: <span className="text-blue-400 font-bold">{currentPlanNode?.weeklySchedule?.length || 0} Days</span>
          </div>
        </div>

        {/* Aggregate Level Grid Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Target Muscle Group", val: currentDayNode?.focus || "Rest Phase", desc: "Primary Focus Region", icon: Target, color: "text-blue-400 bg-blue-500/5" },
            { label: "Volume Workload", val: `${currentDayNode?.exercises?.length || 0} Exercises`, desc: "Total Target Routines", icon: Layers, color: "text-purple-400 bg-purple-500/5" },
            { label: "Cardio System Support", val: currentPlanNode?.cardio?.type || "None Assigned", desc: `Duration: ${currentPlanNode?.cardio?.duration || "N/A"}`, icon: Clock, color: "text-amber-400 bg-amber-500/5" },
            { label: "Intensity Bracket", val: "Hypertrophy", desc: "Neuromuscular Load", icon: Award, color: "text-emerald-400 bg-emerald-500/5" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-neutral-950/40 border border-white/5 p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono tracking-wide text-gray-400 uppercase leading-none">{stat.label}</span>
                <stat.icon className={`w-4 h-4 ${stat.color} p-0.5 rounded`} />
              </div>
              <div>
                <div className="text-md sm:text-lg font-black tracking-tight text-white mb-0.5 truncate">{stat.val}</div>
                <span className="text-[10px] text-gray-500 font-light block leading-none">{stat.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. WEEKLY DAY ROUTINE STRIP */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-400" /> // Select Training Session Node
          </h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {currentPlanNode?.weeklySchedule?.map((sched, dIdx) => {
            const isDayActive = activeDayIdx === dIdx;
            return (
              <button
                key={dIdx}
                onClick={() => {
                  setActiveDayIdx(dIdx);
                  setExpandedExercise(null);
                }}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  isDayActive
                    ? "bg-gradient-to-b from-blue-600 to-blue-700 text-white border-blue-400/20 shadow-lg shadow-blue-900/20 scale-[1.02]"
                    : "bg-neutral-900/40 border-white/5 text-gray-400 hover:text-white hover:border-white/10"
                }`}
              >
                <span className="text-[10px] font-mono tracking-wider uppercase opacity-60">Session</span>
                <span className="text-lg font-black tracking-tight mt-0.5">{sched.day.substring(0, 3)}</span>
                <span className="text-[9px] font-mono tracking-tight mt-1 truncate max-w-full px-1 capitalize">
                  {sched.focus}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. MAIN ROUTINE MATRIX & EXERCISE EXTENSION ACCORDION */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Left/Main Column: Exercises List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h4 className="font-black text-lg tracking-tight text-neutral-200">
              Session Routine Ledger
            </h4>
            <span className="text-xs font-mono text-gray-500">
              Focus: <span className="text-blue-400 font-bold">{currentDayNode?.focus || "Recovery Mode"}</span>
            </span>
          </div>

          {!currentDayNode?.exercises || currentDayNode.exercises.length === 0 ? (
            <div className="p-16 text-center bg-neutral-900/10 border border-white/5 rounded-3xl border-dashed">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-50 animate-pulse" />
              <p className="text-sm font-mono text-gray-400 mb-1">Scheduled Muscle Tissue Optimization Cycle.</p>
              <p className="text-xs text-gray-500">Active rest phase. Complete nervous system downtime recommended.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentDayNode.exercises.map((ex, eIdx) => {
                const isExExpanded = expandedExercise === eIdx;
                return (
                  <div
                    key={eIdx}
                    className="bg-neutral-900/20 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md transition-all hover:border-white/10"
                  >
                    {/* Header Item Click Target */}
                    <div
                      onClick={() => setExpandedExercise(isExExpanded ? null : eIdx)}
                      className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/10 flex items-center justify-center font-mono text-xs font-bold text-blue-400 flex-shrink-0">
                          0{eIdx + 1}
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-md font-black tracking-tight text-white group-hover:text-blue-400 transition-colors truncate">
                            {ex.exercise}
                          </h5>
                          <p className="text-xs text-gray-400 font-mono mt-0.5 flex items-center gap-1.5">
                            <Zap className="w-3 h-3 text-amber-400" /> 
                            Load Settings: <span className="text-gray-200">{ex.sets} Sets × {ex.reps} Reps</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        {ex.restSeconds && (
                          <span className="hidden sm:inline-flex text-[10px] font-mono bg-neutral-800 text-gray-400 px-2 py-0.5 rounded items-center gap-1">
                            ⏱️ {ex.restSeconds}s Rest
                          </span>
                        )}
                        <motion.div
                          animate={{ rotate: isExExpanded ? 90 : 0 }}
                          className="text-gray-500 group-hover:text-white"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Expandable Breakdown Drawer */}
                    <AnimatePresence initial={false}>
                      {isExExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/5 bg-neutral-950/40"
                        >
                          <div className="p-5 space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                              <div className="bg-neutral-900/60 p-3 rounded-xl border border-white/5">
                                <span className="text-gray-500 block text-[10px] uppercase mb-1">Target Strain</span>
                                <span className="text-blue-400 font-bold">{ex.muscleGroup || "Primary Unit"}</span>
                              </div>
                              <div className="bg-neutral-900/60 p-3 rounded-xl border border-white/5">
                                <span className="text-gray-500 block text-[10px] uppercase mb-1">Target Intensity Rest</span>
                                <span className="text-amber-400 font-bold">{ex.restSeconds || "60"} Seconds Intermission</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Dynamic AI Coaching Rules Sidebar */}
        <div className="space-y-6">
          {/* DYNAMIC BLUEPRINT TIPS (Mapped directly from your array) */}
          {currentPlanNode?.tips && currentPlanNode.tips.length > 0 && (
            <div className="bg-neutral-900/30 border border-white/5 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-4 h-4 text-orange-400" />
                <h4 className="font-black text-md text-white tracking-tight">Adaptive Execution Directives</h4>
              </div>
              <p className="text-gray-400 text-xs font-light leading-relaxed mb-4">
                Follow these system parameters customized specifically for your structural layout to accelerate protein optimization vectors:
              </p>
              <div className="space-y-2 font-mono text-[11px]">
                {currentPlanNode.tips.map((tip, idx) => (
                  <div key={idx} className="bg-neutral-950 p-3 rounded-xl border border-white/5 text-gray-300 flex items-start gap-2.5">
                    <span className="text-blue-400 font-bold">⚡</span>
                    <p className="leading-normal">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RECOVERY ANCHOR SYSTEM */}
          <div className="bg-neutral-900/30 border border-white/5 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="font-black text-md text-white tracking-tight">CNS Recovery Parameters</h4>
            </div>
            <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
              <div className="border-l-2 border-emerald-500/40 pl-3">
                <span className="font-mono text-[10px] block text-gray-500">CARDIO BLOCK TYPE</span>
                Execution type configured to <span className="text-emerald-400 font-semibold">{currentPlanNode?.cardio?.type || "LISS"}</span>. Maintain targeted rhythm for <span className="text-emerald-400 font-semibold">{currentPlanNode?.cardio?.duration || "20-30m"}</span>.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}