import type { ElementType } from "react";
import { BadgeCheck, CalendarCheck, Clock, Medal, Rocket, ShieldCheck, Sparkles, Target, Trophy, Zap } from "lucide-react";
import type { Achievement, AchievementCategory, AchievementIcon as AchievementIconType } from "@/types";
import { cn } from "@/lib/utils";

const ICONS: Record<AchievementIconType, ElementType> = {
  sparkles: Sparkles,
  "shield-check": ShieldCheck,
  zap: Zap,
  clock: Clock,
  rocket: Rocket,
  medal: Medal,
  trophy: Trophy,
  "badge-check": BadgeCheck,
  "calendar-check": CalendarCheck,
  target: Target,
};

const CATEGORY_STYLES: Record<AchievementCategory, string> = {
  profile: "bg-violet-50 text-violet-600 border-violet-100",
  verification: "bg-[#FF0078]/10 text-[#FF0078] border-[#FF0078]/20",
  matching: "bg-emerald-50 text-emerald-600 border-emerald-100",
  activity: "bg-blue-50 text-blue-600 border-blue-100",
  projects: "bg-amber-50 text-amber-600 border-amber-100",
  competition: "bg-indigo-50 text-indigo-600 border-indigo-100",
};

type AchievementIconProps = {
  achievement: Achievement;
  size?: "sm" | "md";
  className?: string;
};

export function AchievementIcon({ achievement, size = "sm", className }: AchievementIconProps) {
  const Icon = ICONS[achievement.icon] ?? Sparkles;
  const wrapper = size === "sm" ? "w-5 h-5" : "w-8 h-8";
  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  const tone = CATEGORY_STYLES[achievement.category] ?? "bg-gray-50 text-gray-500 border-gray-100";

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border shrink-0",
        wrapper,
        tone,
        className
      )}
      title={achievement.title}
    >
      <Icon className={iconSize} />
    </span>
  );
}

type AchievementBadgeProps = {
  achievement: Achievement;
};

export function AchievementBadge({ achievement }: AchievementBadgeProps) {
  return (
    <div className="border border-gray-100 rounded-xl p-3 bg-white flex items-start gap-3">
      <AchievementIcon achievement={achievement} size="md" />
      <div>
        <p className="text-sm font-semibold text-gray-900">{achievement.title}</p>
        {achievement.description && (
          <p className="text-xs text-gray-500 mt-0.5">{achievement.description}</p>
        )}
      </div>
    </div>
  );
}
