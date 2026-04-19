import { Badge } from "@/components/ui/badge";
import { ApplicationStatus, JobType } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  applied: { label: "Applied", className: "bg-blue-50 text-blue-700 border-blue-200" },
  shortlisted: { label: "Shortlisted", className: "bg-violet-50 text-violet-700 border-violet-200" },
  reviewing: { label: "Reviewing", className: "bg-amber-50 text-amber-700 border-amber-200" },
  interview: { label: "Interview", className: "bg-[#FF0078]/10 text-[#FF0078] border-[#FF0078]/30" },
  offered: { label: "Offered!", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  rejected: { label: "Rejected", className: "bg-red-50 text-red-700 border-red-200" },
};

const typeConfig: Record<JobType, { label: string; className: string }> = {
  internship: { label: "Internship", className: "bg-[#FF0078]/10 text-[#FF0078] border-[#FF0078]/30" },
  "full-time": { label: "Full-time", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  "part-time": { label: "Part-time", className: "bg-orange-50 text-orange-700 border-orange-200" },
  remote: { label: "Remote", className: "bg-sky-50 text-sky-700 border-sky-200" },
};

export function AppStatusBadge({ status }: { status: ApplicationStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", config.className)}>
      {config.label}
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
