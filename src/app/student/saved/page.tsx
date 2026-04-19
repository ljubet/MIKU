"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { useLang } from "@/lib/language-context";
import { computeMatchScore } from "@/lib/match";
import {
  Bookmark,
  BookmarkCheck,
  MapPin,
  Share2,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Users,
  Clock,
  Wifi,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

const TYPE_STYLES: Record<string, string> = {
  internship: "bg-[#FF0078]/10 text-[#FF0078] border-[#FF0078]/30",
  "full-time": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "part-time": "bg-orange-50 text-orange-700 border-orange-200",
};

export default function SavedPage() {
  const { savedJobs, toggleSave, hasApplied, applyToJob, currentStudent, jobs, applicationQuota } = useApp();
  const { t } = useLang();
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  const saved = jobs.filter((j) => savedJobs.includes(j.id));
  const selectedJob = saved.find((j) => j.id === selectedJobId) ?? saved[0] ?? null;

  const matchScore = selectedJob ? computeMatchScore(selectedJob.tags, currentStudent.skills) : 0;
  const matchedSkills = selectedJob
    ? selectedJob.tags.filter((t) => currentStudent.skills.map((s) => s.toLowerCase()).includes(t.toLowerCase()))
    : [];
  const missingSkills = selectedJob
    ? selectedJob.tags.filter((t) => !currentStudent.skills.map((s) => s.toLowerCase()).includes(t.toLowerCase()))
    : [];

  const isSavedDetail = selectedJob ? savedJobs.includes(selectedJob.id) : false;
  const isApplied = selectedJob ? hasApplied(selectedJob.id) : false;
  const remaining = applicationQuota?.remaining ?? null;
  const limitReached = remaining !== null && remaining <= 0;

  if (saved.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
          <Bookmark className="w-7 h-7 text-gray-300" />
        </div>
        <p className="font-semibold text-gray-700">{t('empty_noResults')}</p>
        <p className="text-sm text-gray-400 mt-1 mb-6">{t('empty_noResultsHint')}</p>
        <Link href="/student/dashboard">
          <Button size="sm" className="bg-[#FF0078] hover:bg-[#d60065] gap-1.5">
            {t('landing_browseBtn')} <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="-mx-4 -my-4 md:-mx-8 md:-my-8 min-h-screen md:h-screen px-4 py-4 md:px-6 md:py-5 bg-gray-50 flex flex-col">

      {/* Helper row */}
      <div className="flex items-center mb-3 px-0.5">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{saved.length}</span> {t('btn_saved').toLowerCase()}
        </p>
      </div>

      {/* Master-detail */}
      <div className="flex flex-col md:flex-row gap-4 flex-1 md:min-h-0">

        {/* LEFT: Saved list */}
        <div className="w-full md:w-[38%] flex flex-col md:min-h-0">
          <div className="flex-1 md:overflow-y-auto space-y-2 pr-1 max-h-[50vh] overflow-y-auto md:max-h-none">
            {saved.map((job) => {
              const score = computeMatchScore(job.tags, currentStudent.skills);
              const isSaved = savedJobs.includes(job.id);
              const isSelected = job.id === (selectedJob?.id ?? "");
              const urgent = job.daysUntilDeadline !== undefined && job.daysUntilDeadline <= 7;

              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                    isSelected ? "border-gray-900 shadow-sm" : "border-gray-200 hover:border-gray-400"
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
                        <p className="font-semibold text-gray-900 text-sm leading-tight truncate">{job.title}</p>
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
                      onClick={(e) => { e.stopPropagation(); toggleSave(job.id); }}
                      className="text-gray-300 hover:text-gray-600 shrink-0 transition-colors"
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4 text-[#FF0078]" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${TYPE_STYLES[job.type] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                      {job.type}
                    </span>
                    {job.salary && <span className="text-xs font-medium text-gray-600">{job.salary}</span>}
                    {urgent && (
                      <span className="text-xs text-amber-600 font-medium flex items-center gap-0.5">
                        <AlertCircle className="w-3 h-3" />
                        {job.daysUntilDeadline}{t('label_daysLeft')}
                      </span>
                    )}
                    <span className={`ml-auto text-xs font-semibold flex items-center gap-0.5 ${score >= 80 ? "text-emerald-600" : "text-[#FF0078]"}`}>
                      <Zap className="w-3 h-3" />
                      {score}%
                    </span>
                  </div>
                </div>
              );
            })}
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
                      <><span className="text-gray-300">·</span><Wifi className="w-3.5 h-3.5" /> {t('label_remoteOk')}</>
                    )}
                  </p>
                  <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${TYPE_STYLES[selectedJob.type] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                      {selectedJob.type}
                    </span>
                    {selectedJob.salary && <span className="text-sm font-semibold text-gray-800">{selectedJob.salary}</span>}
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
              <div className="px-6 py-5 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{t('match_profile')}</p>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-700">{t('match_yourScore')}</p>
                  <span className={`text-sm font-bold flex items-center gap-1 ${matchScore >= 80 ? "text-emerald-600" : "text-[#FF0078]"}`}>
                    <Zap className="w-3.5 h-3.5" />{matchScore}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                  <div className={`h-1.5 rounded-full transition-all ${matchScore >= 80 ? "bg-emerald-500" : "bg-[#FF0078]"}`} style={{ width: `${matchScore}%` }} />
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

              <div className="px-6 py-5 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{t('section_aboutRole')}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedJob.description}</p>
              </div>

              <div className="px-6 py-5 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{t('section_requirements')}</p>
                <div className="space-y-3">
                  {selectedJob.requirements.map((req, i) => (
                    <div key={i} className="flex items-start justify-between gap-6">
                      <p className="text-sm text-gray-700 leading-snug">{req}</p>
                      <span className="text-xs text-gray-300 shrink-0 mt-0.5">#{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-6 py-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{t('section_hiringProcess')}</p>
                <div className="space-y-4">
                  {selectedJob.hiringProcess.map((stage, i) => (
                    <div key={i} className="flex items-start justify-between gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{stage.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{stage.description}</p>
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
                  {isSavedDetail ? <BookmarkCheck className="w-4 h-4 text-[#FF0078]" /> : <Bookmark className="w-4 h-4" />}
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
                  onClick={async () => { if (!limitReached) await applyToJob(selectedJob); }}
                  disabled={limitReached}
                  className={`text-white text-sm font-semibold px-8 py-2.5 rounded-lg transition-colors ${limitReached ? "bg-gray-300 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800"}`}
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
