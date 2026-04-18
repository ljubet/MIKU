"use client";

import { useState } from "react";
import Link from "next/link";
import { Job } from "@/types";
import { useApp } from "@/lib/app-context";
import { computeMatchScore } from "@/lib/mock-data";
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
  const { savedJobs, toggleSave, hasApplied, currentStudent, organizations } = useApp();
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
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="text-xs text-gray-400 font-medium">{job.orgName}</p>
                    {job.verified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-violet-500" />
                    )}
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg leading-tight">{job.title}</h2>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <JobTypeBadge type={job.type} />
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" /> {job.location}
                    </span>
                    {job.remote && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Wifi className="w-3 h-3" /> Remote OK
                      </span>
                    )}
                    {job.salary && (
                      <span className="text-xs font-semibold text-gray-700">{job.salary}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggleSave(job.id)}
                  className="text-gray-300 hover:text-violet-500 transition-colors shrink-0 mt-1"
                >
                  {saved ? (
                    <BookmarkCheck className="w-5 h-5 text-violet-500" />
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
                  {job.applicantCount} applied
                </span>
                {isUrgent && job.daysUntilDeadline !== undefined && (
                  <span className="flex items-center gap-1 text-amber-600 font-semibold">
                    <AlertCircle className="w-3 h-3" />
                    Closes in {job.daysUntilDeadline} days
                  </span>
                )}
                {job.deadline && !isUrgent && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Deadline: {job.deadline}
                  </span>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 px-6 py-5 space-y-6 overflow-y-auto">

              {/* Match score */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Your Match</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    matchScore >= 80 ? "bg-emerald-50 text-emerald-700" :
                    matchScore >= 60 ? "bg-violet-50 text-violet-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    <Zap className="w-3 h-3" /> {matchScore}% match
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                  <div
                    className={`h-1.5 rounded-full ${
                      matchScore >= 80 ? "bg-emerald-500" :
                      matchScore >= 60 ? "bg-violet-500" : "bg-gray-400"
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
                <h3 className="text-sm font-semibold text-gray-900 mb-2">About the role</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{job.description}</p>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">What they're looking for</h3>
                <ul className="space-y-2">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hiring process — the differentiator */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Hiring process</h3>
                <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {job.timeline}
                </p>
                <div className="space-y-3">
                  {job.hiringProcess.map((stage, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-violet-50 border-2 border-violet-200 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-violet-600">{stage.step}</span>
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
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-900">About {org.name}</h3>
                    {org.verified && (
                      <span className="flex items-center gap-1 text-xs text-violet-600 font-medium bg-violet-50 px-2 py-0.5 rounded-full ml-auto">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{org.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <span>📍 {org.location}</span>
                    <span>👥 {org.size} employees</span>
                    {org.founded && <span>📅 Founded {org.founded}</span>}
                    <span>⚡ {org.responseTime}</span>
                  </div>
                  {org.hiresCount > 0 && (
                    <p className="text-xs text-emerald-600 font-medium mt-3 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {org.hiresCount} students hired through Miku
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
                    <CheckCircle2 className="w-4 h-4" /> Application sent
                  </span>
                  <Link href="/student/applications">
                    <Button variant="outline" size="sm" className="text-xs gap-1">
                      Track status <ArrowRight className="w-3 h-3" />
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
                      <><BookmarkCheck className="w-4 h-4 mr-1.5 text-violet-500" /> Saved</>
                    ) : (
                      <><Bookmark className="w-4 h-4 mr-1.5" /> Save</>
                    )}
                  </Button>
                  <Button
                    className="flex-1 bg-violet-600 hover:bg-violet-700 gap-1.5 font-semibold"
                    onClick={() => setApplyOpen(true)}
                  >
                    <Zap className="w-4 h-4" /> Apply Now
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
