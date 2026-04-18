"use client";

import { useState } from "react";
import { mockOrgApplicants, mockJobs } from "@/lib/mock-data";
import { Application, ApplicationStatus } from "@/types";
import { AppStatusBadge } from "@/components/shared/StatusBadge";
import { formatDistanceToNow } from "date-fns";
import { Users, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUS_TABS: { value: ApplicationStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "applied", label: "Applied" },
  { value: "reviewing", label: "Reviewing" },
  { value: "interview", label: "Interview" },
  { value: "offered", label: "Offered" },
  { value: "rejected", label: "Rejected" },
];

const NEXT_STATUS: Partial<Record<ApplicationStatus, ApplicationStatus>> = {
  applied: "reviewing",
  reviewing: "interview",
  interview: "offered",
};

const NEXT_LABEL: Partial<Record<ApplicationStatus, string>> = {
  applied: "Start reviewing",
  reviewing: "Move to interview",
  interview: "Send offer",
};

const statusColors: Record<ApplicationStatus, string> = {
  applied:   "border-l-blue-400",
  reviewing: "border-l-amber-400",
  interview: "border-l-violet-500",
  offered:   "border-l-emerald-500",
  rejected:  "border-l-gray-300",
};

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Application[]>(mockOrgApplicants);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");

  const filtered =
    filter === "all" ? applicants : applicants.filter((a) => a.status === filter);

  const advance = (id: string, current: ApplicationStatus) => {
    const next = NEXT_STATUS[current];
    if (!next) return;
    setApplicants((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: next, updatedAt: new Date().toISOString().split("T")[0] }
          : a
      )
    );
  };

  const reject = (id: string) => {
    setApplicants((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: "rejected", updatedAt: new Date().toISOString().split("T")[0] }
          : a
      )
    );
  };

  // Pipeline summary counts
  const pipeline: { status: ApplicationStatus; label: string; color: string }[] = [
    { status: "applied",   label: "Applied",   color: "bg-blue-100 text-blue-700" },
    { status: "reviewing", label: "Reviewing", color: "bg-amber-100 text-amber-700" },
    { status: "interview", label: "Interview", color: "bg-violet-100 text-violet-700" },
    { status: "offered",   label: "Offered",   color: "bg-emerald-100 text-emerald-700" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
        <p className="text-gray-400 text-sm mt-1">
          {applicants.length} total ·{" "}
          {applicants.filter((a) => a.status === "interview").length} in interview ·{" "}
          {applicants.filter((a) => a.status === "offered").length} offered
        </p>
      </div>

      {/* Pipeline overview */}
      <div className="grid grid-cols-4 gap-3">
        {pipeline.map(({ status, label, color }) => {
          const count = applicants.filter((a) => a.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`bg-white border rounded-xl p-4 text-left hover:border-violet-200 hover:shadow-sm transition-all ${
                filter === status ? "border-violet-300 shadow-sm" : "border-gray-100"
              }`}
            >
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1.5 inline-block ${color}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {STATUS_TABS.map(({ value, label }) => {
          const count = value === "all"
            ? applicants.length
            : applicants.filter((a) => a.status === value).length;
          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                filter === value
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-gray-500 border-gray-200 hover:border-violet-200"
              }`}
            >
              {label}{" "}
              <span className={filter === value ? "text-violet-200" : "text-gray-400"}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Applicant cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No applicants here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const job = mockJobs.find((j) => j.id === app.jobId);
            const nextStatus = NEXT_STATUS[app.status];
            const nextLabel = NEXT_LABEL[app.status];
            const isDone = app.status === "offered" || app.status === "rejected";

            return (
              <div
                key={app.id}
                className={`bg-white border-l-4 border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-all ${statusColors[app.status]}`}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={app.studentAvatar}
                    alt={app.studentName}
                    className="w-10 h-10 rounded-full border border-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {app.studentName}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {app.studentMajor} · {app.studentUniversity}
                        </p>
                      </div>
                      <AppStatusBadge status={app.status} />
                    </div>

                    {job && (
                      <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                        <ChevronRight className="w-3 h-3" />
                        Applied for{" "}
                        <span className="font-medium text-gray-600">{job.title}</span>
                      </p>
                    )}

                    {app.coverNote && (
                      <div className="mt-2.5 bg-gray-50 rounded-lg p-3 border-l-2 border-gray-200">
                        <p className="text-xs text-gray-500 italic leading-relaxed">
                          &ldquo;{app.coverNote}&rdquo;
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                      <p className="text-xs text-gray-300">
                        Applied{" "}
                        {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                      </p>

                      {!isDone && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-7 px-3 text-red-500 border-red-100 hover:bg-red-50 gap-1"
                            onClick={() => reject(app.id)}
                          >
                            <XCircle className="w-3 h-3" /> Reject
                          </Button>
                          {nextStatus && nextLabel && (
                            <Button
                              size="sm"
                              className="text-xs h-7 px-3 bg-violet-600 hover:bg-violet-700 gap-1"
                              onClick={() => advance(app.id, app.status)}
                            >
                              <CheckCircle2 className="w-3 h-3" /> {nextLabel}
                            </Button>
                          )}
                        </div>
                      )}

                      {app.status === "offered" && (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Offer sent
                        </span>
                      )}
                      {app.status === "rejected" && (
                        <span className="text-xs text-gray-400">Archived</span>
                      )}
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
