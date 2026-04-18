"use client";

import { useApp } from "@/lib/app-context";
import { AppStatusBadge } from "@/components/shared/StatusBadge";
import { ApplicationStatus } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { FileText, Clock, MapPin, ArrowRight, Lightbulb } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STATUS_ORDER: ApplicationStatus[] = [
  "interview",
  "offered",
  "reviewing",
  "applied",
  "rejected",
];

const nextActionTip: Record<ApplicationStatus, { text: string; tone: string }> = {
  applied: {
    text: "Most companies review within 5–7 days. Hang tight.",
    tone: "text-blue-500",
  },
  reviewing: {
    text: "Your profile is being evaluated. If it's been over a week, it's okay to follow up.",
    tone: "text-amber-500",
  },
  interview: {
    text: "Research the company, review the hiring process, and prepare for common questions.",
    tone: "text-violet-600",
  },
  offered: {
    text: "You got an offer! Review the terms carefully before accepting.",
    tone: "text-emerald-600",
  },
  rejected: {
    text: "Not every role is the right fit. Keep applying — your next yes is closer.",
    tone: "text-gray-400",
  },
};

export default function ApplicationsPage() {
  const { applications, jobs } = useApp();

  const sorted = [...applications].sort(
    (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <p className="text-gray-400 text-sm mt-1">
          {applications.length} total ·{" "}
          {applications.filter((a) => a.status === "interview").length} in interview
        </p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-5 gap-2">
        {(["applied", "reviewing", "interview", "offered", "rejected"] as ApplicationStatus[]).map(
          (status) => {
            const count = applications.filter((a) => a.status === status).length;
            return (
              <div
                key={status}
                className="bg-white border border-gray-100 rounded-xl p-3 text-center"
              >
                <p className="text-xl font-bold text-gray-900">{count}</p>
                <div className="mt-1.5 flex justify-center">
                  <AppStatusBadge status={status} />
                </div>
              </div>
            );
          }
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7 text-gray-300" />
          </div>
          <p className="font-semibold text-gray-700">No applications yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-6">
            Apply to your first role in under 60 seconds.
          </p>
          <Link href="/student/dashboard">
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700 gap-1.5">
              Find internships <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((app) => {
            const job = jobs.find((j) => j.id === app.jobId);
            if (!job) return null;
            const tip = nextActionTip[app.status];

            return (
              <div
                key={app.id}
                className="bg-white border border-gray-100 rounded-xl p-5 hover:border-violet-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    {job.orgLogo ? (
                      <img src={job.orgLogo} alt={job.orgName} className="w-7 h-7" />
                    ) : (
                      <span className="text-xs font-bold text-gray-400">{job.orgName[0]}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{job.title}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-gray-400">{job.orgName}</span>
                          <span className="flex items-center gap-1 text-xs text-gray-300">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <AppStatusBadge status={app.status} />
                        <span className="flex items-center gap-1 text-xs text-gray-300">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    {app.coverNote && (
                      <p className="text-xs text-gray-400 mt-2 italic line-clamp-1 border-l-2 border-gray-100 pl-2">
                        &ldquo;{app.coverNote}&rdquo;
                      </p>
                    )}

                    {/* Next action tip */}
                    <div className="mt-3 pt-3 border-t border-gray-50 flex items-start gap-2">
                      <Lightbulb className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${tip.tone}`} />
                      <p className={`text-xs leading-relaxed ${tip.tone}`}>{tip.text}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
