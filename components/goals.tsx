"use client";

import { useEffect, useRef, useState } from "react";
import goalsData from "@/data/our_goals.json";

// Handle both array format [...] and object format { "goals": [...] }
const goals: { title: string; description: string }[] = Array.isArray(goalsData)
  ? goalsData
  : (goalsData as any).goals ?? [];
const totalGoals = goals.length;

const Goals = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const accumulatedScrollRef = useRef<number>(0);
  const isCompleteRef = useRef(false); // ref so wheel handlers always see current value

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
  const [isCompleteBottom, setIsCompleteBottom] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const scrollPerGoal = 400;
    const totalScrollNeeded = scrollPerGoal * totalGoals;

    const handleWheel = (e: WheelEvent) => {
      const rect = section.getBoundingClientRect();
      // Relaxed check: section centre is within the viewport
      const isInView =
        rect.top < window.innerHeight * 0.5 &&
        rect.bottom > window.innerHeight * 0.5;

      if (!isInView) return;

      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      const shouldHijack =
        (scrollingDown && !isCompleteRef.current) ||
        (scrollingUp && accumulatedScrollRef.current > 0);

      if (!shouldHijack) return;

      e.preventDefault();
      e.stopPropagation();

      // Accumulate raw scroll delta
      accumulatedScrollRef.current += e.deltaY;
      accumulatedScrollRef.current = Math.max(
        0,
        Math.min(accumulatedScrollRef.current, totalScrollNeeded),
      );

      // Global progress across ALL goals (0 → totalGoals)
      const globalProgress = accumulatedScrollRef.current / scrollPerGoal;

      // Which goal we're on
      const goalIndex = Math.min(
        Math.floor(globalProgress),
        totalGoals - 1,
      );

      // Progress within the current single orbit (0 → 1)
      const orbitProgress = globalProgress - goalIndex;

      setScrollProgress(orbitProgress);
      setCurrentGoalIndex(goalIndex);

      // Completion
      if (accumulatedScrollRef.current >= totalScrollNeeded) {
        isCompleteRef.current = true;
        setIsCompleteBottom(true);
      } else {
        isCompleteRef.current = false;
        setIsCompleteBottom(false);
      }
    };

    // Capture-phase listener to block native scroll while we're hijacking
    const handleWheelCapture = (e: WheelEvent) => {
      const rect = section.getBoundingClientRect();
      const isInView =
        rect.top < window.innerHeight * 0.5 &&
        rect.bottom > window.innerHeight * 0.5;

      if (!isInView) return;

      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      const shouldHijack =
        (scrollingDown && !isCompleteRef.current) ||
        (scrollingUp && accumulatedScrollRef.current > 0);

      if (shouldHijack) {
        e.preventDefault();
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("wheel", handleWheelCapture, {
      passive: false,
      capture: true,
    });

    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("wheel", handleWheelCapture, true);
    };
    // No deps needed — refs keep everything current without re-registering
  }, []);

  // Safety: clamp index and bail if no data
  const safeIndex = Math.max(0, Math.min(currentGoalIndex, totalGoals - 1));
  const currentGoal = goals[safeIndex];
  if (!currentGoal) return null;

  // Calculate orbit position (scrollProgress goes 0→1 per goal)
  const angle = scrollProgress * 2 * Math.PI;
  const orbitRadius = 120;
  const orbitX = Math.cos(angle - Math.PI / 2) * orbitRadius;
  const orbitY = Math.sin(angle - Math.PI / 2) * orbitRadius;

  return (
    <section
      ref={sectionRef}
      className="relative h-screen bg-[#f5f1eb] overflow-hidden flex flex-col justify-center"
    >
      {/* Top Heading */}
      <div className="absolute top-16 left-0 right-0 text-center z-20">
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-gray-900">
          Our Goals
        </h2>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Side - Animated Circle */}
          <div className="flex justify-center items-center">
            <div className="relative w-[320px] h-[320px] lg:w-[360px] lg:h-[360px]">
              {/* Main Circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full bg-[#2E3538] shadow-2xl flex items-center justify-center">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-[#0d6d6e] opacity-80" />
                </div>
              </div>

              {/* Orbit Ring */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 400 400"
              >
                <circle
                  cx="200"
                  cy="200"
                  r={orbitRadius}
                  fill="none"
                  stroke="#2E3538"
                  strokeWidth="2"
                  strokeDasharray="8 8"
                  opacity="0.4"
                />

                {/* Progress Ring */}
                <circle
                  cx="200"
                  cy="200"
                  r={orbitRadius}
                  fill="none"
                  stroke="#0d6d6e"
                  strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * orbitRadius}`}
                  strokeDashoffset={`${
                    2 * Math.PI * orbitRadius * (1 - scrollProgress)
                  }`}
                  transform="rotate(-90 200 200)"
                  opacity="0.6"
                  className="transition-all duration-100"
                />
              </svg>

              {/* Orbiting Small Circle */}
              <div
                className="absolute top-1/2 left-1/2 w-6 h-6 -ml-3 -mt-3 transition-transform duration-100"
                style={{
                  transform: `translate(${orbitX}px, ${orbitY}px)`,
                }}
              >
                <div className="w-full h-full rounded-full bg-[#0d6d6e] shadow-lg animate-pulse" />
              </div>

              {/* Decorative Rings */}
              <svg
                className="absolute inset-0 w-full h-full opacity-20"
                viewBox="0 0 400 400"
              >
                <circle
                  cx="200"
                  cy="200"
                  r={orbitRadius + 30}
                  fill="none"
                  stroke="#2E3538"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <circle
                  cx="200"
                  cy="200"
                  r={orbitRadius - 30}
                  fill="none"
                  stroke="#2E3538"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              </svg>
            </div>
          </div>

          {/* Right Side - Goals */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-center max-w-lg">
              {/* Current Goal Display */}
              <div className="min-h-[180px] flex flex-col items-center justify-center">
                <div
                  key={safeIndex}
                  className="transition-all duration-500 transform"
                >
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 text-gray-600">
                    {currentGoal.title}
                  </h3>
                  <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
                    {currentGoal.description}
                  </p>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-12">
                <div className="flex items-center justify-center gap-3">
                  {goals.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-12 rounded-full transition-all duration-500 ${
                        index === safeIndex
                          ? "bg-[#0d6d6e] w-20"
                          : index < safeIndex
                            ? "bg-[#0d6d6e] opacity-50"
                            : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  {isCompleteBottom
                    ? "All goals revealed! Scroll to continue"
                    : `${safeIndex + 1} of ${totalGoals}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Goals;