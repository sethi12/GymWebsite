"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rajdhani, Inter, JetBrains_Mono } from "next/font/google";
import {
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2,
  ScanSearch,
  X,
  Check,
  CheckCircle2,
  Loader2,
  Plus,
  Minus,
  Save,
  ShieldCheck,
  Sparkles,
  Flame,
  Drumstick,
  Wheat,
  Droplet,
} from "lucide-react";

/**
 * ------------------------------------------------------------------
 * DESIGN SYSTEM - "Vision Lock" HUD
 * ------------------------------------------------------------------
 * A dedicated token set for this component, matching the gym-coach
 * product's "AI vision" identity: a robot coach reading a plate the
 * same way it reads a squat. The scan-frame around the photo and the
 * bracket "lock" state are the signature moment - everything else
 * stays quiet so that one motif reads clearly.
 *
 * NOTE: next/font/google is used here for portability as a drop-in
 * single file. For production, prefer hoisting these three font
 * loaders into your root layout.jsx once, so every page shares the
 * same font instances instead of re-instantiating them per component.
 */
const displayFont = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

const COLORS = {
  void: "#0A0C0F",
  panel: "#12151B",
  edge: "#1E242B",
  cyan: "#2FE6D9",
  ember: "#FF7A3D",
  gold: "#F2BE5C",
  ink: "#EDEFF2",
  ash: "#8791A0",
};

const fontDisplay = { fontFamily: "var(--font-display)" };
const fontMono = { fontFamily: "var(--font-mono)" };

/**
 * ------------------------------------------------------------------
 * Small utilities
 * ------------------------------------------------------------------
 */
const round1 = (n) => Math.round(n * 10) / 10;

const scaleNutrition = (perGram, weight) => {
  const out = {};
  Object.entries(perGram).forEach(([key, pg]) => {
    out[key] = pg === null || pg === undefined ? null : round1(pg * weight);
  });
  return out;
};

const perGramOf = (nutrition, weight) => {
  const w = weight > 0 ? weight : 1;
  const out = {};
  Object.entries(nutrition).forEach(([key, value]) => {
    out[key] = value === null || value === undefined ? null : value / w;
  });
  return out;
};

const fmt = (value, suffix = "") =>
  value === null || value === undefined ? "—" : `${value}${suffix}`;

/**
 * ------------------------------------------------------------------
 * ScanFrame - the signature element.
 * Four HUD corner brackets around the photo. Idle: dashed & dim.
 * Scanning: pulsing cyan + a sweeping scan-line. Locked: solid gold
 * brackets with a small "N ITEMS LOCKED" readout.
 * ------------------------------------------------------------------
 */
function ScanFrame({ state, children, itemCount = 0 }) {
  // state: "idle" | "scanning" | "locked"
  const bracketColor =
    state === "locked" ? COLORS.gold : state === "scanning" ? COLORS.cyan : COLORS.edge;

  const cornerBase =
    "absolute w-8 h-8 border-[3px] transition-colors duration-500";

  return (
    <div className="relative rounded-2xl overflow-hidden bg-black/40 aspect-[4/3]">
      <style jsx>{`
        @keyframes scanSweep {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }
        @keyframes bracketPulse {
          0%,
          100% {
            opacity: 0.55;
          }
          50% {
            opacity: 1;
          }
        }
        .scan-sweep {
          animation: scanSweep 2.2s ease-in-out infinite;
        }
        .bracket-pulse {
          animation: bracketPulse 1.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .scan-sweep,
          .bracket-pulse {
            animation: none !important;
          }
        }
      `}</style>

      {children}

      {/* Corner brackets */}
      <div
        className={`${cornerBase} top-3 left-3 border-r-0 border-b-0 rounded-tl-md ${
          state === "scanning" ? "bracket-pulse" : ""
        }`}
        style={{ borderColor: bracketColor }}
      />
      <div
        className={`${cornerBase} top-3 right-3 border-l-0 border-b-0 rounded-tr-md ${
          state === "scanning" ? "bracket-pulse" : ""
        }`}
        style={{ borderColor: bracketColor }}
      />
      <div
        className={`${cornerBase} bottom-3 left-3 border-r-0 border-t-0 rounded-bl-md ${
          state === "scanning" ? "bracket-pulse" : ""
        }`}
        style={{ borderColor: bracketColor }}
      />
      <div
        className={`${cornerBase} bottom-3 right-3 border-l-0 border-t-0 rounded-br-md ${
          state === "scanning" ? "bracket-pulse" : ""
        }`}
        style={{ borderColor: bracketColor }}
      />

      {/* Sweeping scan line while analyzing */}
      {state === "scanning" && (
        <div
          className="scan-sweep absolute left-0 right-0 h-24 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, transparent, ${COLORS.cyan}33, ${COLORS.cyan}88, ${COLORS.cyan}33, transparent)`,
          }}
        />
      )}

      {/* Locked readout */}
      {state === "locked" && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md"
          style={{ background: "rgba(10,12,15,0.65)", border: `1px solid ${COLORS.gold}55` }}
        >
          <Check size={12} style={{ color: COLORS.gold }} />
          <span
            className="text-[11px] tracking-widest uppercase"
            style={{ ...fontMono, color: COLORS.gold }}
          >
            {itemCount} item{itemCount === 1 ? "" : "s"} locked
          </span>
        </motion.div>
      )}
    </div>
  );
}

/**
 * ------------------------------------------------------------------
 * MacroRing - single donut showing protein / carbs / fat as a share
 * of this meal's macro calories, with total calories in the center.
 * ------------------------------------------------------------------
 */
function MacroRing({ calories, protein, carbs, fat, animate }) {
  const R = 72;
  const STROKE = 14;
  const C = 2 * Math.PI * R;

  const proteinCals = Math.max(protein, 0) * 4;
  const carbsCals = Math.max(carbs, 0) * 4;
  const fatCals = Math.max(fat, 0) * 9;
  const macroSum = proteinCals + carbsCals + fatCals || 1;

  const segments = [
    { key: "protein", label: "Protein", color: COLORS.cyan, cals: proteinCals, grams: protein },
    { key: "carbs", label: "Carbs", color: COLORS.ember, cals: carbsCals, grams: carbs },
    { key: "fat", label: "Fat", color: COLORS.gold, cals: fatCals, grams: fat },
  ];

  let cumulative = 0;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-[180px] h-[180px]">
        <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
          <circle cx="90" cy="90" r={R} fill="none" stroke={COLORS.edge} strokeWidth={STROKE} />
          {segments.map((seg) => {
            const pct = seg.cals / macroSum;
            const len = pct * C;
            const offset = cumulative;
            cumulative += len;
            return (
              <circle
                key={seg.key}
                cx="90"
                cy="90"
                r={R}
                fill="none"
                stroke={seg.color}
                strokeWidth={STROKE}
                strokeLinecap="butt"
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={animate ? -offset : -C}
                style={{
                  transition: "stroke-dashoffset 1.1s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span style={{ ...fontMono, color: COLORS.ink }} className="text-3xl font-semibold">
            {Math.round(calories)}
          </span>
          <span
            style={{ ...fontMono, color: COLORS.ash }}
            className="text-[10px] tracking-widest uppercase mt-0.5"
          >
            kcal
          </span>
        </div>
      </div>

      <div className="w-full space-y-2.5">
        {segments.map((seg) => (
          <div key={seg.key} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: seg.color }} />
              <span style={{ color: COLORS.ash }}>{seg.label}</span>
            </div>
            <span style={{ ...fontMono, color: COLORS.ink }}>
              {round1(seg.grams)}g
              <span style={{ color: COLORS.ash }} className="ml-1.5 text-xs">
                {Math.round((seg.cals / macroSum) * 100)}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ------------------------------------------------------------------
 * MetricPill - small stat card (used for calories + fallback view)
 * ------------------------------------------------------------------
 */
function MetricPill({ icon: Icon, label, value, unit, color }) {
  return (
    <div
      className="flex-1 min-w-[110px] rounded-2xl p-4 border"
      style={{ background: COLORS.panel, borderColor: COLORS.edge }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon size={15} style={{ color }} />
        <span style={{ color: COLORS.ash }} className="text-xs uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div style={{ ...fontMono, color: COLORS.ink }} className="text-xl font-semibold">
        {value}
        <span style={{ color: COLORS.ash }} className="text-xs ml-1">
          {unit}
        </span>
      </div>
    </div>
  );
}

/**
 * ------------------------------------------------------------------
 * FoodCard - animated, editable detected-food row
 * ------------------------------------------------------------------
 */
function FoodCard({ food, index, onWeightChange }) {
  const isVerified = food.source !== "ai-vision-estimate";

  const step = (delta) => {
    const next = Math.max(0, food.weight + delta);
    onWeightChange(food.id, next);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border p-4 sm:p-5"
      style={{ background: COLORS.panel, borderColor: COLORS.edge }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 style={{ ...fontDisplay, color: COLORS.ink }} className="text-lg font-semibold leading-tight">
            {food.originalName}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            {isVerified ? (
              <ShieldCheck size={12} style={{ color: COLORS.cyan }} />
            ) : (
              <Sparkles size={12} style={{ color: COLORS.gold }} />
            )}
            <span
              style={{ color: isVerified ? COLORS.cyan : COLORS.gold }}
              className="text-[11px] uppercase tracking-wide"
            >
              {isVerified ? "Verified data" : "AI estimate"}
            </span>
          </div>
        </div>

        <div
          style={{ ...fontMono, color: COLORS.ink }}
          className="text-2xl font-semibold whitespace-nowrap"
        >
          {Math.round(food.nutrition.calories ?? 0)}
          <span style={{ color: COLORS.ash }} className="text-xs ml-1">
            kcal
          </span>
        </div>
      </div>

      {/* Weight editor */}
      <div
        className="flex items-center justify-between rounded-xl px-3 py-2 mb-4"
        style={{ background: COLORS.void, border: `1px solid ${COLORS.edge}` }}
      >
        <span style={{ color: COLORS.ash }} className="text-xs uppercase tracking-wide">
          Portion
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => step(-10)}
            aria-label={`Decrease ${food.originalName} portion by 10 grams`}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2"
            style={{ background: COLORS.edge, color: COLORS.ink, "--tw-ring-color": COLORS.cyan }}
          >
            <Minus size={13} />
          </button>
          <span style={{ ...fontMono, color: COLORS.ink }} className="text-sm w-14 text-center">
            {food.weight}g
          </span>
          <button
            type="button"
            onClick={() => step(10)}
            aria-label={`Increase ${food.originalName} portion by 10 grams`}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2"
            style={{ background: COLORS.edge, color: COLORS.ink, "--tw-ring-color": COLORS.cyan }}
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      {/* Macro row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div style={{ ...fontMono, color: COLORS.cyan }} className="text-sm font-medium">
            {fmt(food.nutrition.protein, "g")}
          </div>
          <div style={{ color: COLORS.ash }} className="text-[10px] uppercase tracking-wide mt-0.5">
            Protein
          </div>
        </div>
        <div>
          <div style={{ ...fontMono, color: COLORS.ember }} className="text-sm font-medium">
            {fmt(food.nutrition.carbs, "g")}
          </div>
          <div style={{ color: COLORS.ash }} className="text-[10px] uppercase tracking-wide mt-0.5">
            Carbs
          </div>
        </div>
        <div>
          <div style={{ ...fontMono, color: COLORS.gold }} className="text-sm font-medium">
            {fmt(food.nutrition.fat, "g")}
          </div>
          <div style={{ color: COLORS.ash }} className="text-[10px] uppercase tracking-wide mt-0.5">
            Fat
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * ------------------------------------------------------------------
 * Main component
 * ------------------------------------------------------------------
 */
export default function MealAnalyzer() {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);

  const [result, setResult] = useState(null);
  const [editableFoods, setEditableFoods] = useState([]);
  const [ringsAnimated, setRingsAnimated] = useState(false);

  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error

  const handleFile = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setEditableFoods([]);
    setRingsAnimated(false);
    setSaveState("idle");
  };

  const handleNativeCameraClick = (e) => {
    e.stopPropagation();
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && cameraInputRef.current) {
      cameraInputRef.current.click();
    } else {
      startWebcam();
    }
  };

  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Unable to access camera. Please check permissions or upload an image instead.");
    }
  };

  useEffect(() => {
    if (isCameraOpen && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraOpen, stream]);

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const capturedFile = new File([blob], "meal-capture.jpg", { type: "image/jpeg" });
        handleFile(capturedFile);
        stopWebcam();
      }
    }, "image/jpeg");
  };

  const analyzeMeal = async () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    try {
      setAnalyzing(true);

      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/meal/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Meal Response:", data);

      setResult(data);

      const foods = (data?.nutrition?.foods || []).map((food, idx) => {
        const weight = food.weight ?? 0;
        const perGram = perGramOf(food.nutrition, weight);
        return {
          id: `${food.normalizedName}-${idx}`,
          originalName: food.originalName,
          matchedName: food.matchedName,
          source: food.source,
          weight,
          perGram,
          nutrition: { ...food.nutrition },
        };
      });

      setEditableFoods(foods);

      // Let the "locked" bracket state land first, then draw the rings.
      setTimeout(() => setRingsAnimated(true), 250);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze meal.");
    } finally {
      setAnalyzing(false);
    }
  };

  const updateWeight = (id, newWeight) => {
    setEditableFoods((prev) =>
      prev.map((food) =>
        food.id === id
          ? { ...food, weight: newWeight, nutrition: scaleNutrition(food.perGram, newWeight) }
          : food
      )
    );
  };

  const totals = useMemo(() => {
    return editableFoods.reduce(
      (acc, food) => {
        acc.calories += food.nutrition.calories || 0;
        acc.protein += food.nutrition.protein || 0;
        acc.carbs += food.nutrition.carbs || 0;
        acc.fat += food.nutrition.fat || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [editableFoods]);

  const saveMeal = async () => {
    try {
      setSaveState("saving");

      // NOTE: adjust this path to match your actual "save meal" route -
      // this mirrors the /api/meal/upload convention already in use.
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/meal/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: result?.imageUrl,
          fileName: result?.fileName,
          foods: editableFoods.map((f) => ({
            name: f.originalName,
            matchedName: f.matchedName,
            source: f.source,
            weight: f.weight,
            nutrition: f.nutrition,
          })),
          totalNutrition: {
            calories: round1(totals.calories),
            protein: round1(totals.protein),
            carbs: round1(totals.carbs),
            fat: round1(totals.fat),
          },
        }),
      });

      if (!response.ok) throw new Error("Save request failed");

      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2500);
    } catch (err) {
      console.error(err);
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 2500);
    }
  };

  const scanState = analyzing ? "scanning" : result ? "locked" : "idle";

  return (
    <div
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
      style={{ fontFamily: "var(--font-body)", background: COLORS.void, color: COLORS.ink }}
    >
      <style jsx global>{`
        @keyframes gridDrift {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 40px 40px;
          }
        }
        .hud-grid {
          background-image: linear-gradient(${COLORS.edge} 1px, transparent 1px),
            linear-gradient(90deg, ${COLORS.edge} 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridDrift 6s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .hud-grid {
            animation: none;
          }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6"
      >
        {/* Header */}
        <div
          className="rounded-3xl p-6 sm:p-8 relative overflow-hidden border"
          style={{ background: COLORS.panel, borderColor: COLORS.edge }}
        >
          <div className="hud-grid absolute inset-0 opacity-[0.04] pointer-events-none" />
          <div
            className="absolute top-0 right-0 w-72 h-72 blur-3xl rounded-full pointer-events-none"
            style={{ background: `${COLORS.cyan}14` }}
          />

          <div className="relative">
            <span
              style={{ ...fontMono, color: COLORS.cyan }}
              className="text-[11px] tracking-[0.2em] uppercase"
            >
              Vision Module // Meal Scan
            </span>
            <h1 style={fontDisplay} className="text-3xl sm:text-4xl font-bold mt-2">
              Meal Analyzer
            </h1>
            <p style={{ color: COLORS.ash }} className="max-w-2xl mt-2 text-sm sm:text-base">
              Point RoboCoach at your plate. It identifies each item, estimates the portion, and
              breaks down the macros - editable down to the gram.
            </p>
          </div>
        </div>

        {/* Upload state */}
        {!preview && (
          <motion.div whileHover={{ scale: 1.005 }} className="rounded-3xl p-2">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer"
            >
              <ScanFrame state="idle">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl m-1" style={{ borderColor: COLORS.edge }}>
                  <Upload size={40} style={{ color: COLORS.cyan }} />
                  <div className="text-center px-4">
                    <h2 style={fontDisplay} className="text-xl font-semibold">
                      Upload or capture your meal
                    </h2>
                    <p style={{ color: COLORS.ash }} className="text-sm mt-1">
                      Drag & drop, or use the buttons below
                    </p>
                  </div>
                </div>
              </ScanFrame>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2"
                style={{ background: COLORS.cyan, color: COLORS.void, "--tw-ring-color": COLORS.cyan }}
              >
                <Upload size={18} />
                Upload Image
              </button>

              <button
                type="button"
                onClick={handleNativeCameraClick}
                className="px-6 py-3 rounded-xl font-medium flex items-center gap-2 border transition-colors hover:border-white/20 focus-visible:outline-none focus-visible:ring-2"
                style={{ borderColor: COLORS.edge, color: COLORS.ink, "--tw-ring-color": COLORS.cyan }}
              >
                <Camera size={18} />
                Open Camera
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </motion.div>
        )}

        {/* Preview + analyze / results */}
        {preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-2 gap-6">
            <ScanFrame state={scanState} itemCount={editableFoods.length}>
              <img src={preview} alt="Meal preview" className="w-full h-full object-cover" />
            </ScanFrame>

            <div
              className="rounded-2xl border p-6 sm:p-8 flex flex-col justify-center"
              style={{ background: COLORS.panel, borderColor: COLORS.edge }}
            >
              {!result && !analyzing && (
                <>
                  <ImageIcon size={36} style={{ color: COLORS.cyan }} className="mb-3" />
                  <h2 style={fontDisplay} className="text-2xl font-bold mb-2">
                    Ready to scan
                  </h2>
                  <p style={{ color: COLORS.ash }} className="text-sm mb-6">
                    RoboCoach will identify every item on this plate and estimate full nutrition.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={analyzeMeal}
                      className="w-full rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2"
                      style={{ background: COLORS.cyan, color: COLORS.void, "--tw-ring-color": COLORS.cyan }}
                    >
                      <ScanSearch size={19} />
                      Analyze Meal
                    </button>
                    <button
                      onClick={() => {
                        setImage(null);
                        setPreview(null);
                      }}
                      className="w-full rounded-xl py-3.5 font-medium flex items-center justify-center gap-2 border transition-colors focus-visible:outline-none focus-visible:ring-2"
                      style={{ borderColor: COLORS.edge, color: COLORS.ash, "--tw-ring-color": COLORS.cyan }}
                    >
                      <Trash2 size={17} />
                      Remove Image
                    </button>
                  </div>
                </>
              )}

              {analyzing && (
                <div className="flex flex-col items-center text-center py-4">
                  <Loader2 size={34} className="animate-spin mb-4" style={{ color: COLORS.cyan }} />
                  <h2 style={fontDisplay} className="text-xl font-semibold">
                    Scanning plate...
                  </h2>
                  <p style={{ ...fontMono, color: COLORS.ash }} className="text-xs mt-2 tracking-wide">
                    detecting items // estimating weight // resolving macros
                  </p>
                </div>
              )}

              {result && !analyzing && (
                <MacroRing
                  calories={totals.calories}
                  protein={totals.protein}
                  carbs={totals.carbs}
                  fat={totals.fat}
                  animate={ringsAnimated}
                />
              )}
            </div>
          </motion.div>
        )}

        {/* Food cards */}
        {editableFoods.length > 0 && (
          <div>
            <h2 style={fontDisplay} className="text-xl font-semibold mb-3 flex items-center gap-2">
              Detected Items
              <span style={{ ...fontMono, color: COLORS.ash }} className="text-xs font-normal">
                (tap +/- to adjust portion)
              </span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {editableFoods.map((food, idx) => (
                <FoodCard key={food.id} food={food} index={idx} onWeightChange={updateWeight} />
              ))}
            </div>
          </div>
        )}

        {/* Metric summary row (secondary to the ring, for quick scanning) */}
        {editableFoods.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <MetricPill icon={Flame} label="Calories" value={Math.round(totals.calories)} unit="kcal" color={COLORS.ember} />
            <MetricPill icon={Drumstick} label="Protein" value={round1(totals.protein)} unit="g" color={COLORS.cyan} />
            <MetricPill icon={Wheat} label="Carbs" value={round1(totals.carbs)} unit="g" color={COLORS.ember} />
            <MetricPill icon={Droplet} label="Fat" value={round1(totals.fat)} unit="g" color={COLORS.gold} />
          </div>
        )}

        {/* Save Meal */}
        {/* {editableFoods.length > 0 && (
          <button
            onClick={saveMeal}
            disabled={saveState === "saving"}
            className="w-full rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-[1.005] disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2"
            style={{ background: COLORS.gold, color: COLORS.void, "--tw-ring-color": COLORS.gold }}
          >
            {saveState === "saving" && <Loader2 size={19} className="animate-spin" />}
            {saveState === "saved" && <CheckCircle2 size={19} />}
            {(saveState === "idle" || saveState === "error") && <Save size={19} />}
            {saveState === "saving"
              ? "Saving..."
              : saveState === "saved"
              ? "Meal Saved"
              : saveState === "error"
              ? "Save Failed - Retry"
              : "Save Meal"}
          </button>
        )} */}

        {/* Live Webcam Modal */}
        <AnimatePresence>
          {isCameraOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            >
              <div
                className="rounded-3xl p-6 w-full max-w-xl relative flex flex-col items-center border"
                style={{ background: COLORS.panel, borderColor: COLORS.edge }}
              >
                <div className="flex justify-between items-center w-full mb-4">
                  <h3 style={fontDisplay} className="text-xl font-bold flex items-center gap-2">
                    <Camera size={20} style={{ color: COLORS.cyan }} /> Take Photo
                  </h3>
                  <button
                    onClick={stopWebcam}
                    className="p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2"
                    style={{ background: COLORS.edge, "--tw-ring-color": COLORS.cyan }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <ScanFrame state="scanning">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                </ScanFrame>

                <div className="mt-6 flex items-center gap-4">
                  <button
                    onClick={capturePhoto}
                    className="px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2"
                    style={{ background: COLORS.cyan, color: COLORS.void, "--tw-ring-color": COLORS.cyan }}
                  >
                    <Camera size={20} /> Capture Photo
                  </button>
                  <button
                    onClick={stopWebcam}
                    className="px-6 py-3 rounded-xl font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2"
                    style={{ borderColor: COLORS.edge, color: COLORS.ash, "--tw-ring-color": COLORS.cyan }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}