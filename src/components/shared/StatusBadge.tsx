"use client";

import { Badge } from "@/components/ui/badge";
import { ApplicationStatus, JobType } from "@/types";
import { useLang } from "@/lib/language-context";
import { cn } from "@/lib/utils";

const statusStyles: Record<ApplicationStatus, string> = {
  applied: "bg-blue-50 text-blue-700 border-blue-200",
  shortlisted: "bg-violet-50 text-violet-700 border-violet-200",
  reviewing: "bg-amber-50 text-amber-700 border-amber-200",
  interview: "bg-[#FF0078]/10 text-[#FF0078] border-[#FF0078]/30",
  interview_invited: "bg-[#FF0078]/10 text-[#FF0078] border-[#FF0078]/30",
  interview_scheduled: "bg-[#FF0078]/10 text-[#FF0078] border-[#FF0078]/30",
  interview_confirmed: "bg-[#FF0078]/10 text-[#FF0078] border-[#FF0078]/30",
  offered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const typeConfig: Record<JobType, { label: string; className: string }> = {
  internship: { label: "Internship", className: "bg-[#FF0078]/10 text-[#FF0078] border-[#FF0078]/30" },
  "full-time": { label: "Full-time", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  "part-time": { label: "Part-time", className: "bg-orange-50 text-orange-700 border-orange-200" },
  remote: { label: "Remote", className: "bg-sky-50 text-sky-700 border-sky-200" },
};

export function AppStatusBadge({ status }: { status: ApplicationStatus }) {
  const { t } = useLang();
  const labelMap: Record<ApplicationStatus, string> = {
    applied: t("status_applied"),
    shortlisted: t("status_shortlisted"),
    reviewing: t("status_reviewing"),
    interview: t("status_interview"),
    interview_invited: t("status_interview_invited"),
    interview_scheduled: t("status_interview_scheduled"),
    interview_confirmed: t("status_interview_confirmed"),
    offered: t("status_offered"),
    rejected: t("status_rejected"),
  };
  const className = statusStyles[status] ?? statusStyles.interview;
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", className)}>
      {labelMap[status]}
    </Badge>
  );
}

export function JobTypeBadge({ type }: { type: JobType }) {
  const config = typeConfig[type];
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
