"use client";

import { useState, useMemo } from "react";
import { useApp } from "@/lib/app-context";
import { computeMatchScore } from "@/lib/match";
import {
  Trophy,
  MapPin,
  Calendar,
  Zap,
  Users,
  Globe,
  Flame,
  Star,
  ChevronDown,
  Clock,
  Search,
  Gift,
  Sparkles,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────
interface Hackathon {
  id: string;
  name: string;
  organizer: string;
  description: string;
  startDate: string;
  endDate: string;
  deadline: string;
  location: string;
  online: boolean;
  tags: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  prizePool?: string;
  participants: number;
  maxParticipants?: number;
  badges: ("Popular" | "Beginner Friendly" | "High Prize")[];
  accent: string;   // tailwind bg class for card top strip
  skills: string[]; // required skills for match scoring
}

// ── Mock data ──────────────────────────────────────────────────────
const HACKATHONS: Hackathon[] = [
  {
    id: "h1",
    name: "BuildAI 2026",
    organizer: "TechMK",
    description: "Build production-ready AI tools in 48 hours. Real users, real feedback, real impact.",
    startDate: "2026-05-10",
    endDate: "2026-05-12",
    deadline: "2026-05-05",
    location: "Online",
    online: true,
    tags: ["AI", "ML", "Python"],
    difficulty: "Intermediate",
    prizePool: "€1,500",
    participants: 214,
    maxParticipants: 300,
    badges: ["Popular", "High Prize"],
    accent: "from-violet-500 to-purple-600",
    skills: ["Python", "Machine Learning", "React"],
  },
  {
    id: "h2",
    name: "Web3 Skopje Hack",
    organizer: "BlockMKD",
    description: "Your first step into decentralized apps. Mentors available, no prior blockchain experience needed.",
    startDate: "2026-05-24",
    endDate: "2026-05-25",
    deadline: "2026-05-18",
    location: "Skopje, MK",
    online: false,
    tags: ["Web3", "Solidity", "DeFi"],
    difficulty: "Beginner",
    prizePool: "€500",
    participants: 88,
    maxParticipants: 120,
    badges: ["Beginner Friendly"],
    accent: "from-blue-500 to-indigo-600",
    skills: ["JavaScript", "React", "Node.js"],
  },
  {
    id: "h3",
    name: "Design Sprint MKD",
    organizer: "Brainster",
    description: "Two days of pure UX research, prototyping, and user testing. Ship a prototype judges can click.",
    startDate: "2026-06-07",
    endDate: "2026-06-08",
    deadline: "2026-06-01",
    location: "Skopje, MK",
    online: false,
    tags: ["Design", "UX", "Figma"],
    difficulty: "Beginner",
    participants: 60,
    maxParticipants: 80,
    badges: ["Beginner Friendly"],
    accent: "from-pink-500 to-rose-500",
    skills: ["Figma", "UX", "Design"],
  },
  {
    id: "h4",
    name: "FullStack Challenge",
    organizer: "Sorsix",
    description: "End-to-end product in 36 hours. You bring the idea, we bring the infra credits and senior engineers.",
    startDate: "2026-06-20",
    endDate: "2026-06-22",
    deadline: "2026-06-12",
    location: "Online",
    online: true,
    tags: ["Full-Stack", "React", "PostgreSQL"],
    difficulty: "Advanced",
    prizePool: "€2,000",
    participants: 312,
    badges: ["Popular", "High Prize"],
    accent: "from-emerald-500 to-teal-600",
    skills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
  },
  {
    id: "h5",
    name: "Open Data Skopje",
    organizer: "Netcetera",
    description: "Use open government datasets to build tools that matter for citizens. Civic tech at its best.",
    startDate: "2026-07-05",
    endDate: "2026-07-06",
    deadline: "2026-06-28",
    location: "Skopje, MK",
    online: false,
    tags: ["Data", "Civic Tech", "Visualization"],
    difficulty: "Intermediate",
    prizePool: "€800",
    participants: 110,
    maxParticipants: 150,
    badges: [],
    accent: "from-amber-500 to-orange-500",
    skills: ["Python", "Data Analysis", "JavaScript"],
  },
  {
    id: "h6",
    name: "Mobile Hack MKD",
    organizer: "Alkaloid Digital",
    description: "React Native or Flutter — your call. Build a health or wellness app in 48 hours.",
    startDate: "2026-07-19",
    endDate: "2026-07-21",
    deadline: "2026-07-10",
    location: "Online",
    online: true,
    tags: ["Mobile", "React Native", "Flutter"],
    difficulty: "Intermediate",
    prizePool: "€600",
    participants: 145,
    badges: [],
    accent: "from-cyan-500 to-blue-500",
    skills: ["React Native", "JavaScript", "Mobile"],
  },
];

const DIFFICULTY_STYLE = {
  Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Intermediate: "bg-amber-50 text-amber-700 border-amber-200",
  Advanced: "bg-red-50 text-red-700 border-red-200",
};

const BADGE_CONFIG = {
  Popular: { icon: Flame, className: "bg-orange-50 text-orange-600 border-orange-200" },
  "Beginner Friendly": { icon: Star, className: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  "High Prize": { icon: Gift, className: "bg-violet-50 text-violet-600 border-violet-200" },
};

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// ── Main component ─────────────────────────────────────────────────
export default function HackathonsPage() {
  const { currentStudent } = useApp();
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "online" | "in-person">("all");
  const [filterDiff, setFilterDiff] = useState<string>("all");
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [applied, setApplied] = useState<Set<string>>(new Set());

  const scored = useMemo(() =>
    HACKATHONS.map((h) => ({
      ...h,
      match: computeMatchScore(h.skills, currentStudent.skills),
    })),
    [currentStudent.skills]
  );

  const filtered = useMemo(() => {
    return scored.filter((h) => {
      const q = query.toLowerCase();
      if (q && !h.name.toLowerCase().includes(q) && !h.tags.some((t) => t.toLowerCase().includes(q))) return false;
      if (filterType === "online" && !h.online) return false;
      if (filterType === "in-person" && h.online) return false;
      if (filterDiff !== "all" && h.difficulty !== filterDiff) return false;
      return true;
    }).sort((a, b) => b.match - a.match);
  }, [scored, query, filterType, filterDiff]);

  const upcoming = [...scored].sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline)).slice(0, 3);
  const recommended = scored.filter((h) => h.match >= 40).sort((a, b) => b.match - a.match).slice(0, 3);

  return (
    <div className="-mx-4 -my-4 md:-mx-8 md:-my-8 min-h-screen px-4 py-5 md:px-6 md:py-6 bg-gray-50 flex flex-col gap-5">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Hackathons</h1>
          </div>
          <p className="text-sm text-gray-400 ml-10">Discover events, build skills, and compete</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-500 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-violet-500" />
          <span><span className="font-semibold text-gray-800">{scored.filter(h => h.match >= 50).length}</span> hackathons match your skills</span>
        </div>
      </div>

      {/* ── Search + filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hackathons or tags…"
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Type filter */}
          <div className="relative">
            <button
              onClick={() => setOpenFilter(openFilter === "type" ? null : "type")}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all ${filterType !== "all" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
            >
              <Globe className="w-3.5 h-3.5" /> Format <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {openFilter === "type" && (
              <div className="absolute top-full left-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-lg p-2 z-50 min-w-[150px]">
                {[{ v: "all", l: "All" }, { v: "online", l: "Online" }, { v: "in-person", l: "In-person" }].map(({ v, l }) => (
                  <button key={v} onClick={() => { setFilterType(v as typeof filterType); setOpenFilter(null); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors ${filterType === v ? "bg-gray-900 text-white font-semibold" : "text-gray-700 hover:bg-gray-50"}`}>{l}</button>
                ))}
              </div>
            )}
          </div>
          {/* Difficulty filter */}
          <div className="relative">
            <button
              onClick={() => setOpenFilter(openFilter === "diff" ? null : "diff")}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all ${filterDiff !== "all" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
            >
              <Zap className="w-3.5 h-3.5" /> Level <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {openFilter === "diff" && (
              <div className="absolute top-full left-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-lg p-2 z-50 min-w-[160px]">
                {[{ v: "all", l: "All levels" }, { v: "Beginner", l: "Beginner" }, { v: "Intermediate", l: "Intermediate" }, { v: "Advanced", l: "Advanced" }].map(({ v, l }) => (
                  <button key={v} onClick={() => { setFilterDiff(v); setOpenFilter(null); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors ${filterDiff === v ? "bg-gray-900 text-white font-semibold" : "text-gray-700 hover:bg-gray-50"}`}>{l}</button>
                ))}
              </div>
            )}
          </div>
          {(filterType !== "all" || filterDiff !== "all") && (
            <button onClick={() => { setFilterType("all"); setFilterDiff("all"); }} className="text-xs text-gray-400 hover:text-gray-700 underline transition-colors">Clear</button>
          )}
        </div>
      </div>

      {/* Click-outside overlay */}
      {openFilter && <div className="fixed inset-0 z-40" onClick={() => setOpenFilter(null)} />}

      {/* ── Body ── */}
      <div className="flex gap-5 flex-1 min-h-0">

        {/* Cards grid */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Trophy className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-sm font-medium text-gray-600">No hackathons found</p>
              <p className="text-xs mt-1">Try adjusting filters or search terms</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-400 mb-3 font-medium">{filtered.length} hackathons · sorted by match</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filtered.map((h) => {
                  const days = daysUntil(h.deadline);
                  const isApplied = applied.has(h.id);
                  const isHighMatch = h.match >= 60;
                  const fillPct = h.maxParticipants ? Math.round((h.participants / h.maxParticipants) * 100) : null;

                  return (
                    <div
                      key={h.id}
                      className={`bg-white rounded-2xl border overflow-hidden flex flex-col transition-all hover:shadow-md hover:-translate-y-0.5 ${isHighMatch ? "border-violet-200 shadow-sm shadow-violet-100" : "border-gray-200"}`}
                    >
                      {/* Card top accent */}
                      <div className={`h-1.5 bg-gradient-to-r ${h.accent}`} />

                      <div className="p-5 flex flex-col gap-3 flex-1">
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              {isHighMatch && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
                                  <Sparkles className="w-2.5 h-2.5" /> Great for you
                                </span>
                              )}
                              {days <= 7 && days > 0 && (
                                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                                  {days}d left
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-gray-900 text-base leading-tight truncate">{h.name}</h3>
                            <p className="text-xs text-gray-400 mt-0.5">{h.organizer}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className={`text-xs font-bold flex items-center gap-0.5 ${h.match >= 60 ? "text-violet-600" : h.match >= 30 ? "text-amber-600" : "text-gray-400"}`}>
                              <Zap className="w-3 h-3" />{h.match}%
                            </span>
                            <span className="text-[10px] text-gray-300">match</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{h.description}</p>

                        {/* Meta row */}
                        <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 shrink-0" />
                            {fmt(h.startDate)} – {fmt(h.endDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            {h.online ? <Globe className="w-3 h-3 shrink-0" /> : <MapPin className="w-3 h-3 shrink-0" />}
                            {h.location}
                          </span>
                          {h.prizePool && (
                            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                              <Trophy className="w-3 h-3 shrink-0" />{h.prizePool}
                            </span>
                          )}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {h.tags.map((tag) => (
                            <span key={tag} className="text-[11px] px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-full font-medium">{tag}</span>
                          ))}
                          <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${DIFFICULTY_STYLE[h.difficulty]}`}>{h.difficulty}</span>
                        </div>

                        {/* Badges */}
                        {h.badges.length > 0 && (
                          <div className="flex gap-1.5 flex-wrap">
                            {h.badges.map((badge) => {
                              const { icon: Icon, className } = BADGE_CONFIG[badge];
                              return (
                                <span key={badge} className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${className}`}>
                                  <Icon className="w-2.5 h-2.5" />{badge}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        {/* Participants bar */}
                        {fillPct !== null && (
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] text-gray-400 flex items-center gap-1"><Users className="w-3 h-3" />{h.participants} / {h.maxParticipants}</span>
                              <span className="text-[10px] text-gray-400">{fillPct}% full</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1">
                              <div className={`h-1 rounded-full bg-gradient-to-r ${h.accent}`} style={{ width: `${fillPct}%` }} />
                            </div>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-auto pt-1">
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Apply by {fmt(h.deadline)}
                          </span>
                          <button
                            onClick={() => setApplied((prev) => { const n = new Set(prev); isApplied ? n.delete(h.id) : n.add(h.id); return n; })}
                            className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-all ${isApplied ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : `bg-gradient-to-r ${h.accent} text-white hover:opacity-90 shadow-sm`}`}
                          >
                            {isApplied ? "✓ Applied" : "Join"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* ── Right panel ── */}
        <div className="hidden xl:flex flex-col gap-4 w-64 shrink-0">

          {/* Recommended */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Recommended</p>
            <div className="space-y-3">
              {recommended.map((h) => (
                <div key={h.id} className="flex items-start gap-2.5">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${h.accent} flex items-center justify-center shrink-0`}>
                    <Trophy className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate leading-tight">{h.name}</p>
                    <p className="text-[10px] text-violet-600 font-bold">{h.match}% match</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming deadlines */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Deadlines</p>
            <div className="space-y-2.5">
              {upcoming.map((h) => {
                const days = daysUntil(h.deadline);
                return (
                  <div key={h.id} className="flex items-center justify-between gap-2">
                    <p className="text-xs text-gray-700 truncate flex-1 font-medium">{h.name}</p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${days <= 7 ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-500"}`}>
                      {days}d
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity */}
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-4">
            <p className="text-xs font-bold text-violet-500 uppercase tracking-widest mb-3">Your Activity</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Applied</span>
                <span className="text-sm font-extrabold text-violet-700">{applied.size}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Available</span>
                <span className="text-sm font-extrabold text-gray-800">{HACKATHONS.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">High match</span>
                <span className="text-sm font-extrabold text-violet-700">{scored.filter(h => h.match >= 60).length}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
