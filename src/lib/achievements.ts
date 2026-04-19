import { Achievement } from "@/types";

const sortByEarnedAt = (a: Achievement, b: Achievement) => {
  if (!a.earnedAt && !b.earnedAt) return 0;
  if (!a.earnedAt) return 1;
  if (!b.earnedAt) return -1;
  return new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime();
};

export const getEarnedAchievements = (achievements?: Achievement[]) =>
  (achievements ?? []).filter((a) => a.earned).sort(sortByEarnedAt);

export const getHighlightedAchievements = (achievements?: Achievement[], limit = 3) =>
  getEarnedAchievements(achievements)
    .filter((a) => a.highlighted)
    .slice(0, limit);
