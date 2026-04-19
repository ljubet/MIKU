"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { computeMatchScore } from "@/lib/match";
import { JobType } from "@/types";
import { useApp } from "@/lib/app-context";
import { useLang } from "@/lib/language-context";
import { Input } from "@/components/ui/input";
import {
  Search,
  Bookmark,
  BookmarkCheck,
  MapPin,
  Share2,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Users,
  Clock,
  ChevronDown,
  Wifi,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const TYPE_STYLES: Record<string, string> = {
  internship: "bg-[#FF0078]/10 text-[#FF0078] border-[#FF0078]/30",
  "full-time": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "part-time": "bg-orange-50 text-orange-700 border-orange-200",
};

export default function DashboardPage() {
  const { savedJobs, toggleSave, hasApplied, applyToJob, currentStudent, jobs, applicationQuota } =
    useApp();
  const { t } = useLang();

  const [query, setQuery] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"relevant" | "newest" | "salary" | "deadline">("relevant");

  // Filter state
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [salaryOnly, setSalaryOnly] = useState(false);
  const [salaryMin, setSalaryMin] = useState<number | null>(null);
  const [remoteOptions, setRemoteOptions] = useState<string[]>([]);
  const [datePosted, setDatePosted] = useState<string>("all");

  const toggleArr = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  const activeCount = (checks: boolean[]) => checks.filter(Boolean).length;

  const filtered = useMemo(() => {
    const cutoff: Record<string, number> = { "7days": 7, "14days": 14, "30days": 30 };
    const results = jobs.filter((job) => {
      const q = query.toLowerCase();
      if (q && !job.title.toLowerCase().includes(q) && !job.orgName.toLowerCase().includes(q) && !job.tags.some((t) => t.toLowerCase().includes(q))) return false;
      if (jobTypes.length && !jobTypes.includes(job.type)) return false;
      if (salaryOnly && !job.salary) return false;
      if (salaryMin !== null && job.salary) {
        const num = parseInt(job.salary.replace(/[^0-9]/g, "")) || 0;
        if (num < salaryMin) return false;
      }
      if (remoteOptions.length) {
        const wantsRemote = remoteOptions.includes("remote");
        const wantsOnsite = remoteOptions.includes("onsite");
        if (wantsRemote && !job.remote) return false;
        if (wantsOnsite && job.remote) return false;
      }
      if (datePosted !== "all" && cutoff[datePosted]) {
        const days = (Date.now() - new Date(job.postedAt).getTime()) / 86400000;
        if (days > cutoff[datePosted]) return false;
      }
      return true;
    });

    return [...results].sort((a, b) => {
      if (sortBy === "relevant") return computeMatchScore(b.tags, currentStudent.skills) - computeMatchScore(a.tags, currentStudent.skills);
      if (sortBy === "newest") return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      if (sortBy === "salary") {
        const sa = parseInt(a.salary?.replace(/[^0-9]/g, "") || "0");
        const sb = parseInt(b.salary?.replace(/[^0-9]/g, "") || "0");
        return sb - sa;
      }
      if (sortBy === "deadline") {
        const da = a.daysUntilDeadline ?? 999;
        const db = b.daysUntilDeadline ?? 999;
        return da - db;
      }
      return 0;
    });
  }, [jobs, query, jobTypes, salaryOnly, salaryMin, remoteOptions, datePosted, sortBy, currentStudent.skills]);

  const selectedJob = filtered.find((j) => j.id === selectedJobId) ?? filtered[0] ?? null;
  const matchScore = selectedJob ? computeMatchScore(selectedJob.tags, currentStudent.skills) : 0;
  const matchedSkills = selectedJob
    ? selectedJob.tags.filter((t) =>
        currentStudent.skills.map((s) => s.toLowerCase()).includes(t.toLowerCase())
      )
    : [];
  const missingSkills = selectedJob
    ? selectedJob.tags.filter(
        (t) => !currentStudent.skills.map((s) => s.toLowerCase()).includes(t.toLowerCase())
      )
    : [];

  const isSavedDetail = selectedJob ? savedJobs.includes(selectedJob.id) : false;
  const isApplied = selectedJob ? hasApplied(selectedJob.id) : false;
  const remaining = applicationQuota?.remaining ?? null;
  const limitReached = remaining !== null && remaining <= 0;

  return (
    <div className="-mx-4 -my-4 md:-mx-8 md:-my-8 min-h-screen md:h-screen px-4 py-4 md:px-6 md:py-5 bg-gray-50 flex flex-col">

       {/* ── Weekly quota ── */}
       <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 mb-3 flex items-center justify-between">
         <div>
           <p className="text-xs uppercase tracking-wide text-gray-400">{t('limit_weekly')}</p>
           <p className="text-sm font-semibold text-gray-900">
             {remaining !== null ? `${remaining} ${t('limit_remaining')}` : t('limit_loading')}
           </p>
         </div>
         <div
           className={`text-xs font-semibold px-2 py-1 rounded-full ${
             limitReached ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
           }`}
         >
           {limitReached ? t('limit_reached') : t('limit_available')}
         </div>
       </div>

       {/* ── Search bar ── */}
       <div className="relative mb-3">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search_placeholder')}
          className="pl-11 h-12 bg-white border-gray-200 rounded-xl text-sm shadow-sm focus-visible:ring-[#FF0078]"
        />
      </div>

      {/* ── Filter pills ── */}
      <div className="relative mb-4">
        <div className="flex items-center gap-2 flex-wrap">

          {/* Job Type */}
          {(() => {
            const count = jobTypes.length;
            const active = count > 0;
            return (
              <div className="relative shrink-0">
                <button
                  onClick={() => setOpenFilter(openFilter === "type" ? null : "type")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${active ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
                >
                  Job Type {count > 0 && <span className="bg-white text-gray-900 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">{count}</span>}
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
                {openFilter === "type" && (
                  <div className="absolute top-full left-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-lg p-3 z-50 min-w-[180px]">
                    {["internship", "full-time", "part-time"].map((v) => (
                      <label key={v} className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" checked={jobTypes.includes(v)} onChange={() => setJobTypes(toggleArr(jobTypes, v))} className="accent-gray-900 w-4 h-4" />
                        <span className="text-sm text-gray-700 capitalize">{v}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Salary */}
          {(() => {
            const count = activeCount([salaryOnly, salaryMin !== null]);
            const active = count > 0;
            return (
              <div className="relative shrink-0">
                <button
                  onClick={() => setOpenFilter(openFilter === "salary" ? null : "salary")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${active ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
                >
                  Salary {count > 0 && <span className="bg-white text-gray-900 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">{count}</span>}
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
                {openFilter === "salary" && (
                  <div className="absolute top-full left-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-lg p-3 z-50 min-w-[230px]">
                    <label className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-gray-50 cursor-pointer border-b border-gray-100 mb-1">
                      <input type="checkbox" checked={salaryOnly} onChange={() => setSalaryOnly(!salaryOnly)} className="accent-gray-900 w-4 h-4" />
                      <span className="text-sm text-gray-700">Only show jobs with salary</span>
                    </label>
                    {[null, 200, 300, 400, 500].map((v) => (
                      <label key={v ?? "all"} className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input type="radio" checked={salaryMin === v} onChange={() => setSalaryMin(v)} className="accent-gray-900 w-4 h-4" />
                        <span className="text-sm text-gray-700">{v === null ? "All salaries" : `€${v}+/mo`}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Remote */}
          {(() => {
            const count = remoteOptions.length;
            const active = count > 0;
            return (
              <div className="relative shrink-0">
                <button
                  onClick={() => setOpenFilter(openFilter === "remote" ? null : "remote")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${active ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
                >
                  Remote {count > 0 && <span className="bg-white text-gray-900 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">{count}</span>}
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
                {openFilter === "remote" && (
                  <div className="absolute top-full left-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-lg p-3 z-50 min-w-[170px]">
                    {[{ v: "remote", label: "Remote" }, { v: "onsite", label: "On-site" }].map(({ v, label }) => (
                      <label key={v} className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" checked={remoteOptions.includes(v)} onChange={() => setRemoteOptions(toggleArr(remoteOptions, v))} className="accent-gray-900 w-4 h-4" />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Date Posted */}
          {(() => {
            const active = datePosted !== "all";
            return (
              <div className="relative shrink-0">
                <button
                  onClick={() => setOpenFilter(openFilter === "date" ? null : "date")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${active ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
                >
                  Date Posted {active && <span className="bg-white text-gray-900 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">1</span>}
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
                {openFilter === "date" && (
                  <div className="absolute top-full left-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-lg p-3 z-50 min-w-[170px]">
                    {[{ v: "all", label: "Any time" }, { v: "7days", label: "Last 7 days" }, { v: "14days", label: "Last 14 days" }, { v: "30days", label: "Last 30 days" }].map(({ v, label }) => (
                      <label key={v} className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input type="radio" checked={datePosted === v} onChange={() => setDatePosted(v)} className="accent-gray-900 w-4 h-4" />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Clear all */}
          {(jobTypes.length || salaryOnly || salaryMin !== null || remoteOptions.length || datePosted !== "all") ? (
            <button
              onClick={() => { setJobTypes([]); setSalaryOnly(false); setSalaryMin(null); setRemoteOptions([]); setDatePosted("all"); }}
              className="shrink-0 text-xs text-gray-400 hover:text-gray-700 underline transition-colors whitespace-nowrap"
            >
              Clear all
            </button>
          ) : null}
        </div>

        {/* Click-outside dismiss */}
        {openFilter && (
          <div className="fixed inset-0 z-40" onClick={() => setOpenFilter(null)} />
        )}
      </div>

      {/* ── Master-detail ── */}
      <div className="flex flex-col md:flex-row gap-4 flex-1 md:min-h-0">

        {/* LEFT: Job list */}
        <div className="w-full md:w-[38%] flex flex-col md:min-h-0">

          {/* Helper row */}
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{filtered.length}</span> {t('label_results')}
            </p>
            <div className="relative">
              <button
                onClick={() => setOpenFilter(openFilter === "sort" ? null : "sort")}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors"
              >
                {t('label_sort')}:{" "}
                <span className="font-medium text-gray-700 ml-0.5">
                  {sortBy === "relevant" ? t('sort_mostRelevant') : sortBy === "newest" ? "Најнови" : sortBy === "salary" ? "Плата" : "Рок"}
                </span>
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>
              {openFilter === "sort" && (
                <div className="absolute right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-lg p-2 z-50 min-w-[160px]">
                  {([
                    { v: "relevant", label: t('sort_mostRelevant') },
                    { v: "newest", label: "Најнови" },
                    { v: "salary", label: "Највисока плата" },
                    { v: "deadline", label: "Рок (итни прво)" },
                  ] as const).map(({ v, label }) => (
                    <button
                      key={v}
                      onClick={() => { setSortBy(v); setOpenFilter(null); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors ${sortBy === v ? "bg-gray-900 text-white font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Scrollable card list */}
          <div className="flex-1 md:overflow-y-auto space-y-2 pr-1 max-h-[50vh] overflow-y-auto md:max-h-none">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Search className="w-7 h-7 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">{t('empty_noResults')}</p>
                <p className="text-xs mt-1">{t('empty_noResultsHint')}</p>
              </div>
            ) : (
              filtered.map((job) => {
                const score = computeMatchScore(job.tags, currentStudent.skills);
                const isSaved = savedJobs.includes(job.id);
                const isSelected = job.id === (selectedJob?.id ?? "");
                const urgent = job.daysUntilDeadline !== undefined && job.daysUntilDeadline <= 7;

                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                      isSelected
                        ? "border-gray-900 shadow-sm"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                          {job.orgLogo ? (
                            <img src={job.orgLogo} alt={job.orgName} className="w-7 h-7" />
                          ) : (
                            <span className="text-xs font-bold text-gray-500">{job.orgName[0]}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm leading-tight truncate">
                            {job.title}
                          </p>
                          <Link
                            href={`/student/org/${encodeURIComponent(job.orgName)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-gray-500 mt-0.5 flex items-center gap-1 hover:text-[#FF0078] transition-colors w-fit"
                          >
                            {job.orgName}
                            {job.verified && <ShieldCheck className="w-3 h-3 text-[#FF0078]" />}
                          </Link>
                          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {job.location}
                            {job.remote && <span>· {t('label_remoteOk')}</span>}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(job.id);
                        }}
                        className="text-gray-300 hover:text-gray-600 shrink-0 transition-colors"
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4 text-[#FF0078]" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                          TYPE_STYLES[job.type] ?? "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        {job.type}
                      </span>
                      {job.salary && (
                        <span className="text-xs font-medium text-gray-600">{job.salary}</span>
                      )}
                      {urgent && (
                        <span className="text-xs text-amber-600 font-medium flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" />
                          {job.daysUntilDeadline}{t('label_daysLeft')}
                        </span>
                      )}
                      <span
                        className={`ml-auto text-xs font-semibold flex items-center gap-0.5 ${
                          score >= 80 ? "text-emerald-600" : "text-[#FF0078]"
                        }`}
                      >
                        <Zap className="w-3 h-3" />
                        {score}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT: Detail panel */}
        {selectedJob ? (
          <div className="w-full md:w-[62%] bg-white border border-gray-200 rounded-2xl flex flex-col md:min-h-0">

            {/* Header */}
            <div className="px-6 pt-6 pb-5 border-b border-gray-100 shrink-0">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                  {selectedJob.orgLogo ? (
                    <img src={selectedJob.orgLogo} alt={selectedJob.orgName} className="w-9 h-9" />
                  ) : (
                    <span className="text-base font-bold text-gray-500">{selectedJob.orgName[0]}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold text-gray-900 leading-tight">{selectedJob.title}</h1>
                  <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                    <Link href={`/student/org/${encodeURIComponent(selectedJob.orgName)}`} className="hover:text-[#FF0078] transition-colors">{selectedJob.orgName}</Link>
                    {selectedJob.verified && <ShieldCheck className="w-3.5 h-3.5 text-[#FF0078]" />}
                    <span className="text-gray-300">·</span>
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedJob.location}
                    {selectedJob.remote && (
                      <>
                        <span className="text-gray-300">·</span>
                        <Wifi className="w-3.5 h-3.5" /> {t('label_remoteOk')}
                      </>
                    )}
                  </p>
                  <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                        TYPE_STYLES[selectedJob.type] ?? "bg-gray-50 text-gray-600 border-gray-200"
                      }`}
                    >
                      {selectedJob.type}
                    </span>
                    {selectedJob.salary && (
                      <span className="text-sm font-semibold text-gray-800">{selectedJob.salary}</span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDistanceToNow(new Date(selectedJob.postedAt), { addSuffix: true })}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Users className="w-3.5 h-3.5" />
                      {selectedJob.applicantCount} {t('label_applicants')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">

              {/* Profile match */}
              <div className="px-6 py-5 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  {t('match_profile')}
                </p>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-700">{t('match_yourScore')}</p>
                  <span
                    className={`text-sm font-bold flex items-center gap-1 ${
                      matchScore >= 80 ? "text-emerald-600" : "text-[#FF0078]"
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    {matchScore}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      matchScore >= 80 ? "bg-emerald-500" : "bg-[#FF0078]/100"
                    }`}
                    style={{ width: `${matchScore}%` }}
                  />
                </div>
                <div className="space-y-2.5">
                  {matchedSkills.map((s) => (
                    <div key={s} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{s}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                  ))}
                  {missingSkills.map((s) => (
                    <div key={s} className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{s}</span>
                      <span className="text-xs text-gray-300">{t('match_notOnProfile')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* About the role */}
              <div className="px-6 py-5 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  {t('section_aboutRole')}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedJob.description}</p>
              </div>

              {/* Requirements */}
              <div className="px-6 py-5 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  {t('section_requirements')}
                </p>
                <div className="space-y-3">
                  {selectedJob.requirements.map((req, i) => (
                    <div key={i} className="flex items-start justify-between gap-6">
                      <p className="text-sm text-gray-700 leading-snug">{req}</p>
                      <span className="text-xs text-gray-300 shrink-0 mt-0.5">#{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hiring process */}
              <div className="px-6 py-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  {t('section_hiringProcess')}
                </p>
                <div className="space-y-4">
                  {selectedJob.hiringProcess.map((stage, i) => (
                    <div key={i} className="flex items-start justify-between gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{stage.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                          {stage.description}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-gray-400 shrink-0 mt-0.5 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
                        {t('label_step')} {stage.step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSave(selectedJob.id)}
                  className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-all"
                >
                  {isSavedDetail ? (
                    <BookmarkCheck className="w-4 h-4 text-[#FF0078]" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
                <button className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-all">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {isApplied ? (
                <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> {t('btn_applied')}
                </span>
              ) : (
                 <button
                   onClick={async () => {
                     if (!limitReached) await applyToJob(selectedJob);
                   }}
                   disabled={limitReached}
                   className={`text-white text-sm font-semibold px-8 py-2.5 rounded-lg transition-colors ${
                     limitReached
                       ? "bg-gray-300 cursor-not-allowed"
                       : "bg-gray-900 hover:bg-gray-800"
                   }`}
                 >
                   {limitReached ? t('limit_reached') : t('btn_applyNow')}
                 </button>
               )}
             </div>
           </div>
        ) : (
          <div className="hidden md:flex w-full md:w-[62%] bg-white border border-gray-200 rounded-2xl items-center justify-center">
            <p className="text-sm text-gray-400">{t('empty_selectJob')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
