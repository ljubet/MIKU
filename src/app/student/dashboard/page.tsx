"use client";

import { useState, useMemo } from "react";
import { computeMatchScore } from "@/lib/mock-data";
import { JobType } from "@/types";
import { useApp } from "@/lib/app-context";
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

const FILTER_PILLS: { value: JobType | "all" | "remote"; label: string }[] = [
  { value: "all", label: "All jobs" },
  { value: "internship", label: "Internship" },
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "remote", label: "Remote only" },
];

const TYPE_STYLES: Record<string, string> = {
  internship: "bg-violet-50 text-violet-700 border-violet-200",
  "full-time": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "part-time": "bg-orange-50 text-orange-700 border-orange-200",
};

export default function DashboardPage() {
  const { savedJobs, toggleSave, hasApplied, applyToJob, currentStudent, jobs } = useApp();

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.orgName.toLowerCase().includes(q) ||
        job.tags.some((t) => t.toLowerCase().includes(q));
      const matchFilter =
        activeFilter === "all" ||
        (activeFilter === "remote" ? job.remote : job.type === activeFilter);
      return matchQuery && matchFilter;
    });
  }, [query, activeFilter]);

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

  return (
    <div className="-mx-4 -my-4 md:-mx-8 md:-my-8 min-h-screen md:h-screen px-4 py-4 md:px-6 md:py-5 bg-gray-50 flex flex-col">

      {/* ── Search bar ── */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, company, or skill..."
          className="pl-11 h-12 bg-white border-gray-200 rounded-xl text-sm shadow-sm focus-visible:ring-violet-500"
        />
      </div>

      {/* ── Filter pills ── */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
        {FILTER_PILLS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActiveFilter(value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${
              activeFilter === value
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Master-detail ── */}
      <div className="flex flex-col md:flex-row gap-4 flex-1 md:min-h-0">

        {/* LEFT: Job list */}
        <div className="w-full md:w-[38%] flex flex-col md:min-h-0">

          {/* Helper row */}
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{filtered.length}</span> results
            </p>
            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors">
              Sort: <span className="font-medium text-gray-700 ml-0.5">Most relevant</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>
          </div>

          {/* Scrollable card list */}
          <div className="flex-1 md:overflow-y-auto space-y-2 pr-1 max-h-[50vh] overflow-y-auto md:max-h-none">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Search className="w-7 h-7 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">No results found</p>
                <p className="text-xs mt-1">Try adjusting your search</p>
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
                          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                            {job.orgName}
                            {job.verified && <ShieldCheck className="w-3 h-3 text-violet-500" />}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {job.location}
                            {job.remote && <span>· Remote OK</span>}
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
                          <BookmarkCheck className="w-4 h-4 text-violet-500" />
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
                          {job.daysUntilDeadline}d left
                        </span>
                      )}
                      <span
                        className={`ml-auto text-xs font-semibold flex items-center gap-0.5 ${
                          score >= 80 ? "text-emerald-600" : "text-violet-600"
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
                    {selectedJob.orgName}
                    {selectedJob.verified && <ShieldCheck className="w-3.5 h-3.5 text-violet-500" />}
                    <span className="text-gray-300">·</span>
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedJob.location}
                    {selectedJob.remote && (
                      <>
                        <span className="text-gray-300">·</span>
                        <Wifi className="w-3.5 h-3.5" /> Remote OK
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
                      {selectedJob.applicantCount} applicants
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
                  Profile match
                </p>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-700">Your match score</p>
                  <span
                    className={`text-sm font-bold flex items-center gap-1 ${
                      matchScore >= 80 ? "text-emerald-600" : "text-violet-600"
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    {matchScore}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      matchScore >= 80 ? "bg-emerald-500" : "bg-violet-500"
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
                      <span className="text-xs text-gray-300">Not on profile</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* About the role */}
              <div className="px-6 py-5 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  About the role
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedJob.description}</p>
              </div>

              {/* Requirements */}
              <div className="px-6 py-5 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Requirements
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
                  Hiring process
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
                        Step {stage.step}
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
                    <BookmarkCheck className="w-4 h-4 text-violet-500" />
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
                  <CheckCircle2 className="w-4 h-4" /> Applied
                </span>
              ) : (
                <button
                  onClick={() => applyToJob(selectedJob, "")}
                  className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-8 py-2.5 rounded-lg transition-colors"
                >
                  Apply now
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden md:flex w-full md:w-[62%] bg-white border border-gray-200 rounded-2xl items-center justify-center">
            <p className="text-sm text-gray-400">Select a job to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
