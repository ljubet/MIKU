"use client";

import { useState } from "react";
import Link from "next/link";
import { Job } from "@/types";
import { useApp } from "@/lib/app-context";
import { useLang } from "@/lib/language-context";
import { computeMatchScore } from "@/lib/match";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobTypeBadge } from "./StatusBadge";
import { ApplyModal } from "./ApplyModal";
import {
  MapPin,
  Wifi,
  Bookmark,
  BookmarkCheck,
  ShieldCheck,
  Clock,
  Users,
  AlertCircle,
  CheckCircle2,
  Zap,
  ArrowRight,
  Building2,
  Calendar,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface JobDetailPanelProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}

export function JobDetailPanel({ job, open, onClose }: JobDetailPanelProps) {
  const { savedJobs, toggleSave, hasApplied, currentStudent, organizations, applicationQuota } =
    useApp();
  const { t } = useLang();
  const [applyOpen, setApplyOpen] = useState(false);

  if (!job) return null;

  const saved = savedJobs.includes(job.id);
  const applied = hasApplied(job.id);
  const matchScore = computeMatchScore(job.tags, currentStudent.skills);
  const matchedSkills = job.tags.filter((t) =>
    currentStudent.skills.map((s) => s.toLowerCase()).includes(t.toLowerCase())
  );
  const missingSkills = job.tags.filter(
    (t) => !currentStudent.skills.map((s) => s.toLowerCase()).includes(t.toLowerCase())
  );
  const org = organizations.find((o) => o.id === job.orgId);
  const isUrgent = job.daysUntilDeadline !== undefined && job.daysUntilDeadline <= 7;
  const remaining = applicationQuota?.remaining ?? null;
  const limitReached = remaining !== null && remaining <= 0;

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg p-0 overflow-y-auto border-l border-gray-100"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-6 pt-6 pb-5 border-b border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                  {job.orgLogo ? (
                    <img src={job.orgLogo} alt={job.orgName} className="w-9 h-9" />
                  ) : (
                    <span className="text-base font-bold text-gray-500">{job.orgName[0]}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/student/org/${encodeURIComponent(job.orgName)}`}
                    onClick={onClose}
                    className="flex items-center gap-1.5 mb-0.5 w-fit hover:text-[#FF0078] transition-colors"
                  >
                    <p className="text-xs text-gray-400 font-medium hover:text-[#FF0078]">{job.orgName}</p>
                    {job.verified && <ShieldCheck className="w-3.5 h-3.5 text-[#FF0078]" />}
                  </Link>
                  <h2 className="font-bold text-gray-900 text-lg leading-tight">{job.title}</h2>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <JobTypeBadge type={job.type} />
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" /> {job.location}
                    </span>
                    {job.remote && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Wifi className="w-3 h-3" /> {t('label_remoteOk')}
                      </span>
                    )}
                    {job.salary && (
                      <span className="text-xs font-semibold text-gray-700">{job.salary}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggleSave(job.id)}
                  className="text-gray-300 hover:text-[#FF0078] transition-colors shrink-0 mt-1"
                >
                  {saved ? (
                    <BookmarkCheck className="w-5 h-5 text-[#FF0078]" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {job.applicantCount} {t('label_applicants')}
                </span>
                {isUrgent && job.daysUntilDeadline !== undefined && (
                  <span className="flex items-center gap-1 text-amber-600 font-semibold">
                    <AlertCircle className="w-3 h-3" />
                    {job.daysUntilDeadline} {t('label_daysLeft')}
                  </span>
                )}
                {job.deadline && !isUrgent && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {job.deadline}
                  </span>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 px-6 py-5 space-y-6 overflow-y-auto">

              {/* Match score */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{t('match_profile')}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    matchScore >= 80 ? "bg-emerald-50 text-emerald-700" :
                    matchScore >= 60 ? "bg-[#FF0078]/10 text-[#FF0078]" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    <Zap className="w-3 h-3" /> {matchScore}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                  <div
                    className={`h-1.5 rounded-full ${
                      matchScore >= 80 ? "bg-emerald-500" :
                      matchScore >= 60 ? "bg-[#FF0078]/100" : "bg-gray-400"
                    }`}
                    style={{ width: `${matchScore}%` }}
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matchedSkills.map((s) => (
                    <Badge key={s} variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 gap-1">
                      <CheckCircle2 className="w-3 h-3" />{s}
                    </Badge>
                  ))}
                  {missingSkills.map((s) => (
                    <Badge key={s} variant="outline" className="text-xs bg-white text-gray-400 border-gray-200">{s}</Badge>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{t('section_aboutRole')}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{job.description}</p>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('section_requirements')}</h3>
                <ul className="space-y-2">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hiring process */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{t('section_hiringProcess')}</h3>
                <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {job.timeline}
                </p>
                <div className="space-y-3">
                  {job.hiringProcess.map((stage, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-[#FF0078]/10 border-2 border-[#FF0078]/30 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-[#FF0078]">{stage.step}</span>
                        </div>
                        {i < job.hiringProcess.length - 1 && (
                          <div className="w-px h-6 bg-violet-100 mt-1" />
                        )}
                      </div>
                      <div className="pt-0.5 pb-2">
                        <p className="text-sm font-semibold text-gray-800">{stage.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{stage.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company info */}
              {org && (
                <div className="border border-gray-100 rounded-xl p-4">
                  <Link
                    href={`/student/org/${encodeURIComponent(org.name)}`}
                    onClick={onClose}
                    className="flex items-center gap-2 mb-3 group w-fit"
                  >
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#FF0078] transition-colors">{org.name}</h3>
                    {org.verified && (
                      <span className="flex items-center gap-1 text-xs text-[#FF0078] font-medium bg-[#FF0078]/10 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3" /> {t('label_verified')}
                      </span>
                    )}
                  </Link>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{org.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <span>📍 {org.location}</span>
                    <span>👥 {org.size} {t('label_employees')}</span>
                    {org.founded && <span>📅 {org.founded}</span>}
                    <span>⚡ {org.responseTime}</span>
                  </div>
                  {org.hiresCount > 0 && (
                    <p className="text-xs text-emerald-600 font-medium mt-3 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {org.hiresCount} {t('label_studentsHired')}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Sticky CTA */}
            <div className="px-6 py-4 border-t border-gray-100 bg-white">
              {applied ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> {t('btn_applied')}
                  </span>
                  <Link href="/student/applications">
                    <Button variant="outline" size="sm" className="text-xs gap-1">
                      {t('btn_trackStatus')} <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => toggleSave(job.id)}
                  >
                    {saved ? (
                      <><BookmarkCheck className="w-4 h-4 mr-1.5 text-[#FF0078]" /> {t('btn_saved')}</>
                    ) : (
                      <><Bookmark className="w-4 h-4 mr-1.5" /> {t('btn_save')}</>
                    )}
                  </Button>
                   <Button
                     className={`flex-1 gap-1.5 font-semibold ${
                       limitReached ? "bg-gray-300 text-white cursor-not-allowed" : "bg-[#FF0078] hover:bg-[#d60065]"
                     }`}
                     onClick={() => !limitReached && setApplyOpen(true)}
                     disabled={limitReached}
                   >
                     <Zap className="w-4 h-4" /> {limitReached ? t('limit_reached') : t('btn_applyNow')}
                   </Button>
                 </div>
               )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <ApplyModal
        job={job}
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
      />
    </>
  );
}
