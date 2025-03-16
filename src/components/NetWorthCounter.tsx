
import { useSpending } from "@/contexts/SpendingContext";
import { useEffect, useState, useCallback } from "react";
import { formatCurrency } from "@/lib/utils";
import confetti from "canvas-confetti";
import useSound from "use-sound";

export function NetWorthCounter() {
  const { remaining, spent, ELON_NET_WORTH } = useSpending();
  const [isAnimating, setIsAnimating] = useState(false);
  const [playCashSound] = useSound('/sounds/cash.mp3', { volume: 0.5 });
  const [playMilestoneSound] = useSound('/sounds/achievement.mp3', { volume: 0.7 });

  const celebrateMilestone = useCallback(() => {
    const milestones = [1e8, 1e9, 1e10, 5e10, 1e11, 2e11];
    const nearestMilestone = milestones.find(m => {
      // Make the threshold more lenient to ensure milestone detection
      const threshold = m * 0.1; // 10% threshold
      return spent >= m && spent - m <= threshold;
    });
    
    if (nearestMilestone) {
      // Ensure the sound plays by adding a small delay
      setTimeout(() => {
        playMilestoneSound();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 100);
    }
  }, [spent, playMilestoneSound]);

  useEffect(() => {
    setIsAnimating(true);
    if (spent > 0) {
      playCashSound();
      celebrateMilestone();
    }
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [remaining, playCashSound, celebrateMilestone]);

  const spentPercentage = Math.min((spent / ELON_NET_WORTH) * 100, 100);

  return (
    <div className="flex flex-col gap-4 p-5 sm:p-6 rounded-xl shadow-lg bg-gradient-to-r from-blue-900 to-blue-600 text-white hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
      <div className="text-center">
        <h2 className="text-lg sm:text-xl font-medium mb-1 opacity-90">
          Elon Musk's Total Money
        </h2>
        <div className={`money-counter text-4xl sm:text-5xl font-bold ${isAnimating ? 'animate scale-105 transition-transform' : ''}`}>
          {formatCurrency(remaining)}
        </div>
        <p className="text-xs sm:text-sm mt-1 opacity-80">
          of {formatCurrency(ELON_NET_WORTH)}
        </p>
      </div>

      <div className="w-full bg-blue-200/30 rounded-full h-3 overflow-hidden">
        <div 
          className="h-full transition-all duration-1000 ease-out relative overflow-hidden"
          style={{
            width: `${spentPercentage}%`,
            background: `linear-gradient(90deg, 
              rgba(239, 68, 68, 1) ${Math.max(0, spentPercentage - 5)}%, 
              rgba(248, 113, 113, 1) ${spentPercentage}%
            )`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
        </div>
      </div>

      <div className="flex justify-between text-xs sm:text-sm">
        <span className="font-medium">Spent: {formatCurrency(spent)}</span>
        <span className="font-medium">Remaining: {formatCurrency(remaining)}</span>
      </div>
    </div>
  );
}