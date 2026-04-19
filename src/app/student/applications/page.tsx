"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { useLang } from "@/lib/language-context";
import { AppStatusBadge } from "@/components/shared/StatusBadge";
import { getJobDescription, getJobInterviewInsights, getJobTitle } from "@/lib/job-copy";
import { ApplicationStatus } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { FileText, Clock, MapPin, ArrowRight, Lightbulb, ChevronDown, ChevronUp, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STATUS_ORDER: ApplicationStatus[] = [
  "shortlisted",
  "interview_confirmed",
  "interview_scheduled",
  "interview_invited",
  "interview",
  "offered",
  "reviewing",
  "applied",
  "rejected",
];

export default function ApplicationsPage() {
  const { applications, jobs, applicationsLoading } = useApp();
  const { t, lang } = useLang();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const interviewInviteStatuses: ApplicationStatus[] = [
    "interview_invited",
    "interview_scheduled",
    "interview_confirmed",
  ];
  const isInterviewStatus = (status: ApplicationStatus) =>
    status === "interview" || interviewInviteStatuses.includes(status);

  const nextActionTip: Record<ApplicationStatus, { text: string; tone: string }> = {
    applied: {
      text: t('tip_applied'),
      tone: "text-blue-500",
    },
    shortlisted: {
      text: t('tip_shortlisted'),
      tone: "text-violet-500",
    },
    reviewing: {
      text: t('tip_reviewing'),
      tone: "text-amber-500",
    },
    interview: {
      text: t('tip_interview'),
      tone: "text-[#FF0078]",
    },
    interview_invited: {
      text: t('tip_interview'),
      tone: "text-[#FF0078]",
    },
    interview_scheduled: {
      text: t('tip_interview'),
      tone: "text-[#FF0078]",
    },
    interview_confirmed: {
      text: t('tip_interview'),
      tone: "text-[#FF0078]",
    },
    offered: {
      text: t('tip_offered'),
      tone: "text-emerald-600",
    },
    rejected: {
      text: t('tip_rejected'),
      tone: "text-gray-400",
    },
  };

  const sorted = [...applications].sort(
    (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('page_applications')}</h1>
        <p className="text-gray-400 text-sm mt-1">
          {applications.length} {t('label_total')} ·{" "}
          {applications.filter((a) => isInterviewStatus(a.status)).length} {t('label_inInterview')}
        </p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {(
          ["applied", "shortlisted", "reviewing", "interview", "offered", "rejected"] as ApplicationStatus[]
        ).map(
          (status) => {
            const count = status === "interview"
              ? applications.filter((a) => isInterviewStatus(a.status)).length
              : applications.filter((a) => a.status === status).length;
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

      {applicationsLoading ? (
        <div className="text-center py-20 text-gray-400 text-sm">{t('limit_loading')}</div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7 text-gray-300" />
          </div>
          <p className="font-semibold text-gray-700">{t('empty_noApplications')}</p>
          <p className="text-sm text-gray-400 mt-1 mb-6">
            {t('empty_noApplicationsHint')}
          </p>
          <Link href="/student/dashboard">
            <Button size="sm" className="bg-[#FF0078] hover:bg-[#d60065] gap-1.5">
              {t('btn_findInternships')} <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((app) => {
            const job = jobs.find((j) => j.id === app.jobId);
            if (!job) return null;
            const tip = nextActionTip[app.status];
            const jobTitle = getJobTitle(job, lang);
            const jobDescription = getJobDescription(job, lang);
            const insights =
              getJobInterviewInsights(job, lang) ?? {
                intro: t('interview_insights_intro'),
                interviewQuestions: [
                  t("interview_insights_fallback_q1"),
                  t("interview_insights_fallback_q2"),
                  t("interview_insights_fallback_q3"),
                ],
                preparationTips: [
                  t("interview_insights_fallback_tip1"),
                  t("interview_insights_fallback_tip2"),
                  t("interview_insights_fallback_tip3"),
                ],
                interviewStages: [
                  t("interview_insights_fallback_stage1"),
                  t("interview_insights_fallback_stage2"),
                ],
              };
            const insightsUnlocked = interviewInviteStatuses.includes(app.status);

            const isExpanded = expandedId === app.id;

            return (
              <div
                key={app.id}
                className="bg-white border border-gray-100 rounded-xl p-5 hover:border-[#FF0078]/30 hover:shadow-sm transition-all cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => setExpandedId(isExpanded ? null : app.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setExpandedId(isExpanded ? null : app.id);
                  }
                }}
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
                        <p className="text-sm font-semibold text-gray-900">{jobTitle}</p>
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
                        <span className="flex items-center gap-1 text-[11px] text-gray-300">
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          {t('btn_viewDetails')}
                        </span>
                      </div>
                    </div>

                    {app.coverNote && (
                      <p className="text-xs text-gray-400 mt-2 italic line-clamp-1 border-l-2 border-gray-100 pl-2">
                        &ldquo;{app.coverNote}&rdquo;
                      </p>
                    )}

                    {isExpanded && (
                      <>
                        <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-500 leading-relaxed">
                          {jobDescription}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">
                              {t('interview_insights_title')}
                            </h3>
                            <span className="text-[11px] text-gray-400">{t('interview_insights_helper')}</span>
                          </div>

                          {insightsUnlocked ? (
                            <div className="mt-3 space-y-4 text-xs text-gray-600">
                              <p className="text-gray-500">{insights.intro}</p>

                              <div>
                                <p className="text-xs font-semibold text-gray-700 mb-2">
                                  {t('interview_insights_questions')}
                                </p>
                                <ul className="list-disc pl-4 space-y-1 text-gray-500">
                                  {insights.interviewQuestions.map((q) => (
                                    <li key={q}>{q}</li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <p className="text-xs font-semibold text-gray-700 mb-2">
                                  {t('interview_insights_prepare')}
                                </p>
                                <ul className="list-disc pl-4 space-y-1 text-gray-500">
                                  {insights.preparationTips.map((tipItem) => (
                                    <li key={tipItem}>{tipItem}</li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <p className="text-xs font-semibold text-gray-700 mb-2">
                                  {t('interview_insights_process')}
                                </p>
                                <ul className="list-disc pl-4 space-y-1 text-gray-500">
                                  {insights.interviewStages.map((stage) => (
                                    <li key={stage}>{stage}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-3 rounded-xl border border-dashed border-[#FF0078]/30 bg-[#FF0078]/5 p-4">
                              <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center border border-[#FF0078]/20">
                                  <Lock className="w-4 h-4 text-[#FF0078]" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {t('interview_insights_locked_title')}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {t('interview_insights_locked_desc')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
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
