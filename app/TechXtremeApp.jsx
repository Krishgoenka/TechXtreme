"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Badge,
  BookOpen,
  Brain,
  Camera,
  Code,
  Gift,
  Github,
  Globe,
  Heart,
  Laugh,
  Lightbulb,
  Mail,
  MessageCircle,
  Mic,
  Music,
  Phone,
  Plus,
  Rocket,
  Star,
  Ticket,
  Trophy,
  User,
  Users,
  Zap,
} from "lucide-react";
import { Audiowide } from "next/font/google";
import { useState } from "react";

const audiowide = Audiowide({
  subsets: ["latin"],
  weight: "400", // Use the correct weight for your font
});
// Enhanced Animated Background with Particles
import { useAnimation, useMotionValue } from "framer-motion";
import React, { useCallback, useEffect } from "react";

import { useMemo } from "react";

// Constants for better maintainability

const CONSTANTS = {
  BASE_PARTICLES: 75,
  CONSTELLATION_PARTICLES: 15,
  ORBS: 4,
  MOUSE_INFLUENCE_RADIUS: 200,
  GRID_SIZE: 50,
  PARTICLE_ANIMATION_DURATION: {
    MIN: 4,
    MAX: 12,
  },
};

// SSR-safe utility functions
const utils = {
  getRandomPoint: (dimensions) => ({
    x: Math.random() * (dimensions?.width || 1920), // fallback for SSR
    y: Math.random() * (dimensions?.height || 1080), // fallback for SSR
  }),

  getDistance: (p1, p2) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  },

  getOrbGradient: (index) => ({
    background: `radial-gradient(circle,
      ${index % 2 ? "rgba(34, 211, 238, 0.2)" : "rgba(129, 140, 248, 0.2)"} 0%,
      ${index % 2 ? "rgba(6, 182, 212, 0.1)" : "rgba(67, 56, 202, 0.1)"} 100%)`,
  }),
};

const Orb = ({ index }) => (
  <motion.div
    className="absolute w-96 h-96 rounded-full blur-3xl mix-blend-overlay"
    style={{
      ...utils.getOrbGradient(index),
      top: `${25 + index * 15}%`,
      left: `${20 + index * 20}%`,
    }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
      x: [0, 50, 0],
      y: [0, 30, 0],
    }}
    transition={{
      duration: 10 + index * 2,
      repeat: Infinity,
      ease: "easeInOut",
      delay: index * 2,
    }}
  />
);

const GridOverlay = () => (
  <motion.div
    className="absolute inset-0"
    style={{
      background: `linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
                  linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
      backgroundSize: `${CONSTANTS.GRID_SIZE}px ${CONSTANTS.GRID_SIZE}px`,
    }}
    animate={{
      backgroundPosition: [
        "0px 0px",
        `${CONSTANTS.GRID_SIZE}px ${CONSTANTS.GRID_SIZE}px`,
      ],
    }}
    transition={{
      duration: 20,
      repeat: Infinity,
      ease: "linear",
    }}
  />
);

const MouseTrail = ({ mousePosition }) => (
  <motion.div
    className="absolute w-32 h-32 rounded-full pointer-events-none"
    style={{
      background:
        "radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 70%)",
      x: mousePosition.x - 64,
      y: mousePosition.y - 64,
    }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.4, 0.2],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// Utility functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// SSR-safe browser detection
const isBrowser = () => typeof window !== "undefined";

const ParticleWithMouseInteraction = React.memo(
  ({ initialPoint, mousePosition, getRandomPoint }) => {
    const controls = useAnimation();

    useEffect(() => {
      const animate = async () => {
        while (true) {
          const targetPoint = getRandomPoint();
          const distance = utils.getDistance(initialPoint, mousePosition);
          const isNearMouse = distance < CONSTANTS.MOUSE_INFLUENCE_RADIUS;

          await controls.start({
            x: isNearMouse
              ? initialPoint.x + (initialPoint.x - mousePosition.x) * 0.1
              : targetPoint.x,
            y: isNearMouse
              ? initialPoint.y + (initialPoint.y - mousePosition.y) * 0.1
              : targetPoint.y,
            opacity: [0, 0.8, 0],
            scale: isNearMouse ? [1, 1.5, 1] : [1, 1.2, 1],
            transition: {
              duration: isNearMouse
                ? 2
                : Math.random() *
                    (CONSTANTS.PARTICLE_ANIMATION_DURATION.MAX -
                      CONSTANTS.PARTICLE_ANIMATION_DURATION.MIN) +
                  CONSTANTS.PARTICLE_ANIMATION_DURATION.MIN,
              ease: isNearMouse ? "easeOut" : "linear",
            },
          });
        }
      };
      animate();
    }, [mousePosition, controls, getRandomPoint, initialPoint]);

    return (
      <motion.div
        className="absolute"
        animate={controls}
        initial={{
          ...initialPoint,
          opacity: 0,
        }}
      >
        <motion.div
          className="w-1 h-1 bg-cyan-400 rounded-full"
          style={{
            boxShadow: "0 0 10px rgba(34, 211, 238, 0.5)",
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    );
  }
);

const AnimatedBackground = () => {
  const [isClient, setIsClient] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({
    width: isBrowser() ? window.innerWidth : 1920,
    height: isBrowser() ? window.innerHeight : 1080,
  });

  const mouseXVelocity = useMotionValue(0);
  const mouseYVelocity = useMotionValue(0);

  // Memoized arrays
  const baseParticles = useMemo(
    () => Array.from({ length: CONSTANTS.BASE_PARTICLES }),
    []
  );
  const constellationParticles = useMemo(
    () => Array.from({ length: CONSTANTS.CONSTELLATION_PARTICLES }),
    []
  );
  const orbs = useMemo(() => Array.from({ length: CONSTANTS.ORBS }), []);

  // Set isClient to true on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Debounced resize handler
  useEffect(() => {
    if (!isBrowser()) return;

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const debouncedHandleResize = debounce(handleResize, 250);

    handleResize();
    window.addEventListener("resize", debouncedHandleResize);
    return () => window.removeEventListener("resize", debouncedHandleResize);
  }, []);

  // Throttled mouse movement handler
  useEffect(() => {
    if (!isBrowser()) return;

    let lastX = 0;
    let lastY = 0;
    let lastTime = Date.now();

    const handleMouseMove = throttle((e) => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;

      const velocityX = (e.clientX - lastX) / deltaTime;
      const velocityY = (e.clientY - lastY) / deltaTime;

      mouseXVelocity.set(velocityX);
      mouseYVelocity.set(velocityY);
      setMousePosition({ x: e.clientX, y: e.clientY });

      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = currentTime;
    }, 16);

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseXVelocity, mouseYVelocity]);

  const getRandomPoint = useCallback(
    () => utils.getRandomPoint(dimensions),
    [dimensions]
  );

  // If not client-side, render minimal content
  if (!isClient) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <GridOverlay />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((_, i) => (
        <Orb key={`orb-${i}`} index={i} />
      ))}

      <GridOverlay />

      {constellationParticles.map((_, i) => {
        const initialPoint = getRandomPoint();
        const targetPoint = getRandomPoint();

        return (
          <motion.div
            key={`constellation-${i}`}
            className="absolute w-2 h-2 bg-cyan-300 rounded-full"
            initial={{ ...initialPoint, opacity: 0 }}
            animate={{
              x: [initialPoint.x, targetPoint.x],
              y: [initialPoint.y, targetPoint.y],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <div className="absolute inset-0 blur-sm bg-cyan-300 opacity-50" />
          </motion.div>
        );
      })}

      {baseParticles.map((_, i) => (
        <ParticleWithMouseInteraction
          key={`particle-${i}`}
          initialPoint={getRandomPoint()}
          mousePosition={mousePosition}
          getRandomPoint={getRandomPoint}
        />
      ))}

      <MouseTrail mousePosition={mousePosition} />
    </div>
  );
};

// Enhanced Form Input with Floating Label
const FormInput = ({ label, type = "text", icon: Icon, error, ...props }) => (
  <motion.div
    className="relative"
    // initial={{ opacity: 0, y: 20 }}
    // animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <label className="text-cyan-300 text-sm mb-1 block transform transition-all">
      {label}
    </label>
    <div className="relative group">
      <Icon
        className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 transition-transform group-hover:scale-110"
        size={18}
      />
      <input
        type={type}
        className="w-full bg-gray-900/50 border border-cyan-800/30 rounded-lg py-3 px-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300"
        {...props}
      />
      <motion.div
        className="absolute inset-0 border border-cyan-400 rounded-lg opacity-0 scale-105"
        // animate={props.value ? { opacity: 0.2 } : { opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-400 text-xs mt-1"
      >
        {error}
      </motion.p>
    )}
  </motion.div>
);

// Event Card Component with Enhanced Animations
const EventCard = ({
  title,
  description,
  icon: Icon,
  features,
  onClick,
  variant,
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`
      bg-gray-900/40 p-8 rounded-2xl border border-cyan-800/30 backdrop-blur-sm
      hover:bg-gray-900/60 transition-all duration-500 cursor-pointer
      ${
        variant === "primary" ? " border-cyan-500/50 " : "border-purple-500/50 "
      }
    `}
    onClick={onClick}
  >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center mb-6"
    >
      <div className="relative">
        <Icon
          className={`
            ${variant === "primary" ? "text-cyan-400" : "text-purple-400"}
            transition-all duration-500
          `}
          size={48}
          strokeWidth={1.5}
        />
        <motion.div
          className={`
            absolute -inset-2 rounded-full blur-lg
            ${variant === "primary" ? "bg-cyan-400/20" : "bg-purple-400/20"}
          `}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <h3
        className={`ml-6 text-3xl font-light tracking-wide ${
          variant === "primary" ? "text-cyan-400" : "text-purple-400"
        }`}
      >
        {title}
      </h3>
    </motion.div>
    <p className="text-gray-300 font-light leading-relaxed mb-6">
      {description}
    </p>
    <div className="grid grid-cols-2 gap-4">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-2 text-cyan-200/70"
        >
          <feature.icon size={16} className="flex-shrink-0" />
          <span className="text-sm">{feature.text}</span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// Registration Forms for Different Types

const formFields = [
  { id: "name", label: "Full Name", type: "text" },
  { id: "email", label: "Email", type: "email" },
  { id: "github", label: "GitHub Profile", type: "url" },
];

const IdeathonForm = ({ handleSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    batchId: "",
    teamName: "",
    projectTitle: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  // Enhanced animations
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const formVariants = {
    initial: {
      x: 300,
      opacity: 0,
      rotate: 5,
    },
    animate: {
      x: 0,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    exit: {
      x: -300,
      opacity: 0,
      rotate: -5,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const inputVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className={audiowide.className}>
      <div className="min-h-screen flex items-center justify-center p-4 ">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-2xl p-8 rounded-xl backdrop-blur-lg bg-grey/1 border border-cyan-900/70 shadow-xl border-glow "
        >
          <motion.h2
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-3xl mb-8 text-cyan-500 font-[Audiowide] text-center"
          >
            Ideathon Registration
          </motion.h2>

          <form
            onSubmit={handleFormSubmit}
            className="space-y-6"
            autoComplete="off"
          >
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={formVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="flex flex-col gap-6">
                    <motion.div variants={inputVariants}>
                      <label className="block text-cyan-400 mb-2 font-[Audiowide]">
                        Name
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-cyan-900/50 rounded-lg p-3 text-cyan-100 placeholder-cyan-300 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 transition-all duration-300 autofill:bg-black/50 autofill:text-cyan-100"
                        required
                      />
                    </motion.div>
                    <motion.div variants={inputVariants}>
                      <label className="block text-cyan-400 mb-2 font-[Audiowide]">
                        Email
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-cyan-900/50 rounded-lg p-3 text-cyan-100 focus:outline-none focus:border-cyan-500 transition-colors"
                        required
                      />
                    </motion.div>
                  </div>
                  <motion.div
                    className="flex justify-end"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleNext}
                      className="relative px-8 py-3 font-[Audiowide] text-cyan-300
                    border border-cyan-500 rounded-lg backdrop-blur-lg
                    bg-black/10 shadow-md shadow-cyan-500/20
                    transition-transform duration-300 ease-in-out"
                    >
                      Proceed
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={formVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="flex flex-col gap-6">
                    <motion.div variants={inputVariants}>
                      <label className="block text-cyan-400 mb-2 font-[Audiowide]">
                        Batch ID
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="text"
                        name="batchId"
                        value={formData.batchId}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-cyan-900/50 rounded-lg p-3 text-cyan-100 focus:outline-none focus:border-cyan-500 transition-colors"
                        required
                      />
                    </motion.div>
                    <motion.div variants={inputVariants}>
                      <label className="block text-cyan-400 mb-2 font-[Audiowide]">
                        Team Name
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="text"
                        name="teamName"
                        value={formData.teamName}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-cyan-900/50 rounded-lg p-3 text-cyan-100 focus:outline-none focus:border-cyan-500 transition-colors"
                        required
                      />
                    </motion.div>
                  </div>
                  <motion.div
                    className="flex justify-between"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleBack}
                      className="relative px-8 py-3 font-[Audiowide] text-cyan-300
                    border border-cyan-500 rounded-lg backdrop-blur-lg
                    bg-black/10 shadow-md shadow-cyan-500/20
                    transition-transform duration-300 ease-in-out"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleNext}
                      className="relative px-8 py-3 font-[Audiowide] text-cyan-300
                    border border-cyan-500 rounded-lg backdrop-blur-lg
                    bg-black/10 shadow-md shadow-cyan-500/20
                    transition-transform duration-300 ease-in-out"
                    >
                      Proceed
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={formVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="flex flex-col gap-6">
                    <motion.div variants={inputVariants}>
                      <label className="block text-cyan-400 mb-2 font-[Audiowide]">
                        Project Title
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="text"
                        name="projectTitle"
                        value={formData.projectTitle}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-cyan-900/50 rounded-lg p-3 text-cyan-100 focus:outline-none focus:border-cyan-500 transition-colors"
                        required
                      />
                    </motion.div>
                    <motion.div variants={inputVariants}>
                      <label className="block text-cyan-400 mb-2 font-[Audiowide]">
                        Brief Description
                      </label>
                      <motion.textarea
                        whileFocus={{ scale: 1.02 }}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-cyan-900/50 rounded-lg p-3 text-cyan-100 focus:outline-none focus:border-cyan-500 transition-colors h-24"
                        required
                      />
                    </motion.div>
                  </div>
                  <motion.div
                    className="flex justify-between"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleNext}
                      className="relative px-8 py-3 font-[Audiowide] text-cyan-300
                    border border-cyan-500 rounded-lg backdrop-blur-lg
                    bg-black/10 shadow-md shadow-cyan-500/20
                    transition-transform duration-300 ease-in-out"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleBack}
                      className="relative px-8 py-3 font-[Audiowide] text-cyan-300
                    border border-cyan-500 rounded-lg backdrop-blur-lg
                    bg-black/10 shadow-md shadow-cyan-500/20
                    transition-transform duration-300 ease-in-out"
                    >
                      Initialize
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

const GenAIForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    github: "",
    experience: "",
    projectIdea: "",
  });

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      <FormInput
        label="Full Name"
        icon={User}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <FormInput
        label="Email"
        type="email"
        icon={Mail}
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <FormInput
        label="GitHub Profile"
        icon={Github}
        value={formData.github}
        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
        required
      />
      <div className="relative">
        <label className="text-cyan-300 text-sm mb-1 block">
          Experience with AI
        </label>
        <textarea
          className="w-full bg-gray-900/50 border border-cyan-800/30 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 h-32"
          value={formData.experience}
          onChange={(e) =>
            setFormData({ ...formData, experience: e.target.value })
          }
          required
          placeholder="Describe your experience with AI..."
        />
      </div>
      <div className="relative">
        <label className="text-cyan-300 text-sm mb-1 block">Project Idea</label>
        <textarea
          className="w-full bg-gray-900/50 border border-cyan-800/30 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 h-32"
          value={formData.projectIdea}
          onChange={(e) =>
            setFormData({ ...formData, projectIdea: e.target.value })
          }
          required
          placeholder="Describe your project idea..."
        />
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-cyan-700 to-cyan-600 text-white py-3 rounded-lg font-medium tracking-wider uppercase text-sm hover:from-cyan-600 hover:to-cyan-500 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/30"
      >
        Submit
      </button>
    </motion.form>
  );
};

const CulturalForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    event: "",
    performanceDetails: "",
  });

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      <FormInput
        label="Full Name"
        icon={User}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <FormInput
        label="Email"
        type="email"
        icon={Mail}
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <FormInput
        label="Phone Number"
        type="tel"
        icon={Phone}
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
      />
      <div className="relative">
        <label className="text-cyan-300 text-sm mb-1 block">Event</label>
        <select
          className="w-full bg-gray-900/50 border border-cyan-800/30 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300"
          value={formData.event}
          onChange={(e) => setFormData({ ...formData, event: e.target.value })}
          required
        >
          <option value="">Select an event</option>
          <option value="dance">Dance</option>
          <option value="music">Music</option>
          <option value="drama">Drama</option>
        </select>
      </div>
      <div className="relative">
        <label className="text-cyan-300 text-sm mb-1 block">
          Performance Details
        </label>
        <textarea
          className="w-full bg-gray-900/50 border border-cyan-800/30 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 h-32"
          value={formData.performanceDetails}
          onChange={(e) =>
            setFormData({ ...formData, performanceDetails: e.target.value })
          }
          required
          placeholder="Describe your performance..."
        />
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-cyan-700 to-cyan-600 text-white py-3 rounded-lg font-medium tracking-wider uppercase text-sm hover:from-cyan-600 hover:to-cyan-500 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/30"
      >
        Submit
      </button>
    </motion.form>
  );
};

const AudienceForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      <FormInput
        label="Full Name"
        icon={User}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <FormInput
        label="Email"
        type="email"
        icon={Mail}
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <FormInput
        label="Phone Number"
        type="tel"
        icon={Phone}
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
      />
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-cyan-700 to-cyan-600 text-white py-3 rounded-lg font-medium tracking-wider uppercase text-sm hover:from-cyan-600 hover:to-cyan-500 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/30"
      >
        Submit
      </button>
    </motion.form>
  );
};

// Main App Component
const TechXtremeApp = () => {
  const [activeRegistration, setActiveRegistration] = useState(null);
  const [registrationType, setRegistrationType] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showCulturalEvents, setShowCulturalEvents] = useState(false);

  const handleSubmit = (formData) => {
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex flex-col justify-center items-center p-8 relative overflow-hidden">
      <AnimatedBackground />
      <AnimatePresence>
        {submitted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 max-w-2xl p-12 bg-gray-900/70 rounded-3xl border border-cyan-800/50 backdrop-blur-xl"
          >
            <Zap
              className="mx-auto mb-6 text-cyan-400 animate-pulse"
              size={80}
              strokeWidth={1.5}
            />
            <h2 className="text-4xl text-cyan-300 mb-6 tracking-wider uppercase">
              Registration Completed
            </h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Your digital synchronization is complete. Quantum communication
              protocols initialized.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setActiveRegistration(null);
              }}
              className="bg-gradient-to-r from-cyan-700 to-cyan-600 text-white px-10 py-4 rounded-lg font-medium tracking-wider uppercase text-sm hover:from-cyan-600 hover:to-cyan-500 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/30"
            >
              Return to Interface{" "}
              <ArrowRight className="inline ml-2" size={18} />
            </button>
          </motion.div>
        ) : (
          <>
            {!activeRegistration && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10 max-w-6xl"
              >
                {!showCulturalEvents ? (
                  <>
                    <h1 className="text-7xl font-extralight mb-12 text-white tracking-wider animate-fade-in-up text-center">
                      <span className="text-white font-thin">TECH</span>
                      <span className="text-cyan-400 font-light">XTREME</span>
                    </h1>

                    <div className="grid grid-cols-2 gap-8 mb-16">
                      <EventCard
                        title="IdeaThon"
                        description="Innovative problem-solving marathon. Collaborative tech challenges driving breakthrough solutions across emerging technological domains."
                        icon={Lightbulb}
                        features={[
                          { icon: Code, text: "Coding Challenges" },
                          { icon: Brain, text: "Problem Solving" },
                          { icon: Rocket, text: "Innovation" },
                          { icon: Globe, text: "Global Participation" },
                        ]}
                        onClick={() => setActiveRegistration("ideathon")}
                        variant="primary"
                      />
                      <EventCard
                        title="Cultural Fest"
                        description="A celebration of culture, art, and creativity. Showcase your talents in music, dance, drama, and more."
                        icon={Music}
                        features={[
                          { icon: Ticket, text: "Performances" },
                          { icon: Camera, text: "Photography" },
                          { icon: Heart, text: "Cultural Exchange" },
                          { icon: BookOpen, text: "Storytelling" },
                        ]}
                        onClick={() => setShowCulturalEvents(true)}
                        variant="secondary"
                      />
                    </div>

                    <div className="flex justify-center space-x-8 animate-fade-in-up">
                      <button
                        onClick={() => setActiveRegistration("ideathon")}
                        className="relative px-12 py-6 rounded-lg font-medium tracking-wider uppercase text-sm text-white shadow-[0_4px_10px_rgba(0,255,255,0.5)] transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30
    before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-700 before:to-cyan-600 before:opacity-0 before:transition-opacity before:duration-500 before:hover:opacity-100 overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center">
                          <Award className="mr-3 inline" strokeWidth={1.5} />
                          Ideathon Registration
                        </span>
                      </button>

                      <button
                        onClick={() => setShowCulturalEvents(true)}
                        className="relative px-12 py-6 rounded-lg font-medium tracking-wider uppercase text-sm text-white shadow-[0_4px_10px_rgba(128,0,128,0.5)] transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30
    before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-700 before:to-purple-600 before:opacity-0 before:transition-opacity before:duration-500 before:hover:opacity-100 overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center">
                          <Users className="mr-3 inline" strokeWidth={1.5} />
                          Cultural Fest Registration
                        </span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-10">
                    <EventCard
                      title="GenAI Study Jams Swags"
                      description="Distribution of official merchandise from Google for securing Top 80 spot in GenAI Study Jams"
                      icon={Gift}
                      features={[
                        { icon: Trophy, text: "Top 80 Achievers" },
                        { icon: Gift, text: "Exclusive Google Merch" },
                        { icon: Badge, text: "Official Recognition" },
                        { icon: Star, text: "Elite Performer Status" },
                      ]}
                      onClick={() => setActiveRegistration("genai")}
                      variant="primary"
                    />
                    <EventCard
                      title="Cultural Programs"
                      description="Join our vibrant cultural showcases, featuring music, dance, standup, and much more!"
                      icon={Music}
                      features={[
                        { icon: Mic, text: "Live Performances" },
                        { icon: Laugh, text: "Standup Comedy" },
                        { icon: Globe, text: "Open to All" },
                        { icon: Plus, text: "Surprise Events" },
                      ]}
                      onClick={() => setActiveRegistration("cultural")}
                      variant="secondary"
                    />
                    <EventCard
                      title="Attendee Registration"
                      description="Register to be part of the TechXtreme experience as an audience member."
                      icon={Users}
                      features={[
                        { icon: Ticket, text: "Free Entry" },
                        { icon: MessageCircle, text: "Networking" },
                      ]}
                      onClick={() => setActiveRegistration("audience")}
                      variant="primary"
                    />
                  </div>
                )}
              </motion.div>
            )}

            {activeRegistration && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 w-full h-full z-10"
              >
                {activeRegistration === "ideathon" && (
                  <IdeathonForm onSubmit={handleSubmit} />
                )}
                {activeRegistration === "genai" && (
                  <GenAIForm onSubmit={handleSubmit} />
                )}
                {activeRegistration === "cultural" && (
                  <CulturalForm onSubmit={handleSubmit} />
                )}
                {activeRegistration === "audience" && (
                  <AudienceForm onSubmit={handleSubmit} />
                )}
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
export default TechXtremeApp;
