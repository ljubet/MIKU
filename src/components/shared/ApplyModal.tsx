"use client";

import { useState } from "react";
import { Job } from "@/types";
import { useApp } from "@/lib/app-context";
import { useLang } from "@/lib/language-context";
import { computeMatchScore } from "@/lib/match";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { JobTypeBadge } from "./StatusBadge";
import { MapPin, Wifi, CheckCircle2, Zap, ShieldCheck, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ApplyModalProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}

export function ApplyModal({ job, open, onClose }: ApplyModalProps) {
  const { applyToJob, hasApplied, currentStudent, applicationQuota } = useApp();
  const { t } = useLang();
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!job) return null;

  const alreadyApplied = hasApplied(job.id);
  const matchScore = computeMatchScore(job.tags, currentStudent.skills);
  const matchedSkills = job.tags.filter((sk) =>
    currentStudent.skills.map((s) => s.toLowerCase()).includes(sk.toLowerCase())
  );
  const missingSkills = job.tags.filter(
    (sk) => !currentStudent.skills.map((s) => s.toLowerCase()).includes(sk.toLowerCase())
  );

  const remaining = applicationQuota?.remaining ?? null;
  const limitReached = remaining !== null && remaining <= 0;

  const handleApply = async () => {
    setError(null);
    if (limitReached) {
      setError(t('limit_reached_desc'));
      return;
    }
    const result = await applyToJob(job);
    if (!result.ok) {
      if (result.reason === "limit") setError(t('limit_reached_desc'));
      if (result.reason === "duplicate") setError(t('limit_duplicate'));
      return;
    }
    setApplied(true);
  };

  const handleClose = () => {
    setApplied(false);
    setError(null);
    onClose();
  };

  if (applied || alreadyApplied) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t('btn_applied')}!</h2>
            <p className="text-gray-500 text-sm mb-1">
              <span className="font-semibold text-gray-800">{job.title}</span>
            </p>
            <p className="text-gray-400 text-xs mb-4">{job.orgName}</p>
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-xs text-gray-500 mb-6 text-left w-full">
              <p className="flex items-center gap-1.5 font-medium text-gray-700 mb-1">
                <Clock className="w-3.5 h-3.5" /> {t('section_hiringProcess')}
              </p>
              <p>{job.timeline}</p>
            </div>
            <Button onClick={handleClose} className="bg-[#FF0078] hover:bg-[#d60065] w-full">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">{t('btn_applyNow')}</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {t('match_profile')}
          </DialogDescription>
        </DialogHeader>

        {/* Job summary */}
        <div className="bg-gray-50 rounded-xl p-4 mt-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0">
              {job.orgLogo ? (
                <img src={job.orgLogo} alt={job.orgName} className="w-7 h-7" />
              ) : (
                <span className="text-sm font-bold text-gray-500">{job.orgName[0]}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-gray-900 text-sm">{job.title}</p>
                {job.verified && <ShieldCheck className="w-3.5 h-3.5 text-[#FF0078] shrink-0" />}
              </div>
              <p className="text-xs text-gray-400">{job.orgName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <JobTypeBadge type={job.type} />
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="w-3 h-3" />
              {job.location}
            </span>
            {job.remote && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Wifi className="w-3 h-3" />
                {t('label_remoteOk')}
              </span>
            )}
            {job.salary && (
              <span className="text-xs font-semibold text-gray-700">{job.salary}</span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {job.timeline}
          </p>
        </div>

        {/* Skill match breakdown */}
        <div className="border border-gray-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              {t('match_yourScore')}
            </p>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                matchScore >= 80
                  ? "bg-emerald-50 text-emerald-700"
                  : matchScore >= 60
                  ? "bg-[#FF0078]/10 text-[#FF0078]"
                  : "bg-gray-50 text-gray-600"
              }`}
            >
              <Zap className="w-3 h-3" />
              {matchScore}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
            <div
              className={`h-1.5 rounded-full transition-all ${
                matchScore >= 80
                  ? "bg-emerald-500"
                  : matchScore >= 60
                  ? "bg-[#FF0078]/100"
                  : "bg-gray-400"
              }`}
              style={{ width: `${matchScore}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {matchedSkills.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 gap-1"
              >
                <CheckCircle2 className="w-3 h-3" />
                {skill}
              </Badge>
            ))}
            {missingSkills.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="text-xs bg-gray-50 text-gray-400 border-gray-200"
              >
                {skill}
              </Badge>
            ))}
          </div>

          {missingSkills.length > 0 && (
            <p className="text-xs text-gray-400 mt-2.5">
              {t('match_notOnProfile')}: {missingSkills.length}
            </p>
          )}
        </div>

        {/* Profile preview */}
        <div className="border border-gray-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            {t('profile_nameUniversity')}
          </p>
          <div className="flex items-center gap-3">
            <img
              src={currentStudent.avatar}
              alt={currentStudent.name}
              className="w-9 h-9 rounded-full border border-gray-100"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">{currentStudent.name}</p>
              <p className="text-xs text-gray-400">
                {currentStudent.major} · {currentStudent.university}
              </p>
            </div>
          </div>
        </div>

        {/* Weekly quota */}
        <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">{t('limit_weekly')}</span>
            <span className={limitReached ? "text-red-500 font-semibold" : "text-emerald-600 font-semibold"}>
              {remaining !== null ? `${remaining} ${t('limit_remaining')}` : t('limit_loading')}
            </span>
          </div>
          <p className="text-gray-400 mt-1">{t('limit_hint')}</p>
        </div>

        {error && (
          <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={limitReached}
            className={`flex-1 gap-1.5 font-semibold ${
              limitReached ? "bg-gray-300 text-white cursor-not-allowed" : "bg-[#FF0078] hover:bg-[#d60065]"
            }`}
          >
            <Zap className="w-4 h-4" />
            {t('btn_applyNow')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
