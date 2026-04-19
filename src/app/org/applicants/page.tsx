"use client";

import { useMemo, useState } from "react";
import { ApplicationStatus } from "@/types";
import { AppStatusBadge } from "@/components/shared/StatusBadge";
import { useLang } from "@/lib/language-context";
import { formatDistanceToNow } from "date-fns";
import {
  Users, CheckCircle2, XCircle, ShieldCheck, Zap,
  Briefcase, ChevronDown, BookOpen, Lightbulb, Clock, ExternalLink, Star,
} from "lucide-react";
import { useApp } from "@/lib/app-context";
import { computeMatchScore } from "@/lib/match";

const STATUS_COLOR: Record<ApplicationStatus, string> = {
  applied:     "border-l-blue-400",
  shortlisted: "border-l-violet-500",
  reviewing:   "border-l-amber-400",
  interview:   "border-l-[#FF0078]",
  offered:     "border-l-emerald-500",
  rejected:    "border-l-gray-200",
};

const NEXT_STATUS: Partial<Record<ApplicationStatus, ApplicationStatus>> = {
  applied: "shortlisted",
  shortlisted: "interview",
  interview: "offered",
};

export default function ApplicantsPage() {
  const { orgApplications, jobs, setOrgApplicationStatus } = useApp();
  const { t } = useLang();

  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  const [selectedJobId, setSelectedJobId] = useState<string>("all");
  const [selectedAppId, setSelectedAppId] = useState<string>("");
  const [jobDropOpen, setJobDropOpen] = useState(false);

  // Jobs that belong to this org
  const orgJobs = useMemo(() => jobs.filter((j) => j.orgId === "11111111-1111-1111-1111-111111111111" || j.orgName === "TechMK"), [jobs]);

  const jobMap = useMemo(() => new Map(jobs.map((j) => [j.id, j])), [jobs]);

  const NEXT_LABEL: Partial<Record<ApplicationStatus, string>> = {
    applied: t("btn_shortlist"),
    shortlisted: t("btn_moveToInterview"),
    interview: t("btn_sendOffer"),
  };

  const STATUS_TABS: { value: ApplicationStatus | "all"; label: string }[] = [
    { value: "all", label: t("tab_all") },
    { value: "applied", label: t("tab_applied") },
    { value: "shortlisted", label: t("tab_shortlisted") },
    { value: "reviewing", label: t("tab_reviewing") },
    { value: "interview", label: t("tab_interview") },
    { value: "offered", label: t("tab_offered") },
    { value: "rejected", label: t("tab_rejected") },
  ];

  const filtered = useMemo(() => {
    return orgApplications.filter((a) => {
      if (filter !== "all" && a.status !== filter) return false;
      if (selectedJobId !== "all" && a.jobId !== selectedJobId) return false;
      return true;
    });
  }, [orgApplications, filter, selectedJobId]);

  const selectedApp = filtered.find((a) => a.id === selectedAppId) ?? filtered[0] ?? null;
  const selectedJob = selectedApp ? jobMap.get(selectedApp.jobId) : null;

  const matchScore = selectedJob && selectedApp?.studentSkills
    ? computeMatchScore(selectedJob.tags, selectedApp.studentSkills)
    : null;

  const matchedSkills = selectedJob && selectedApp?.studentSkills
    ? selectedJob.tags.filter((t) => selectedApp.studentSkills!.map((s) => s.toLowerCase()).includes(t.toLowerCase()))
    : [];

  const missingSkills = selectedJob && selectedApp?.studentSkills
    ? selectedJob.tags.filter((t) => !selectedApp.studentSkills!.map((s) => s.toLowerCase()).includes(t.toLowerCase()))
    : [];

  const advance = async (id: string, current: ApplicationStatus) => {
    const next = NEXT_STATUS[current];
    if (next) await setOrgApplicationStatus(id, next);
  };

  const reject = async (id: string) => setOrgApplicationStatus(id, "rejected");

  const isDone = (s: ApplicationStatus) => s === "offered" || s === "rejected";

  const pipeline = [
    { status: "applied" as ApplicationStatus, label: t("tab_applied"), color: "bg-blue-100 text-blue-700" },
    { status: "shortlisted" as ApplicationStatus, label: t("tab_shortlisted"), color: "bg-violet-100 text-violet-700" },
    { status: "interview" as ApplicationStatus, label: t("tab_interview"), color: "bg-[#FF0078]/10 text-[#FF0078]" },
    { status: "offered" as ApplicationStatus, label: t("tab_offered"), color: "bg-emerald-100 text-emerald-700" },
  ];

  const selectedJobLabel = selectedJobId === "all"
    ? "All positions"
    : orgJobs.find((j) => j.id === selectedJobId)?.title ?? "All positions";

  return (
    <div className="-mx-4 -my-4 md:-mx-8 md:-my-8 min-h-screen md:h-screen px-4 py-4 md:px-6 md:py-5 bg-gray-50 flex flex-col gap-4">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("page_applicants")}</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {orgApplications.length} {t("label_total")} · {orgApplications.filter((a) => a.status === "interview").length} {t("label_inInterview")} · {orgApplications.filter((a) => a.status === "offered").length} {t("tab_offered").toLowerCase()}
        </p>
      </div>

      {/* ── Pipeline overview ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
        {pipeline.map(({ status, label, color }) => {
          const count = orgApplications.filter((a) => a.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilter(status === filter ? "all" : status)}
              className={`bg-white border rounded-xl p-4 text-left hover:border-[#FF0078]/30 hover:shadow-sm transition-all ${filter === status ? "border-[#FF0078]/50 shadow-sm" : "border-gray-100"}`}
            >
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1.5 inline-block ${color}`}>{label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Master-detail ── */}
      <div className="flex gap-4 flex-1 md:min-h-0">

        {/* LEFT: list */}
        <div className="w-full md:w-[38%] flex flex-col gap-3 md:min-h-0">

          {/* Job filter */}
          <div className="relative">
            <button
              onClick={() => setJobDropOpen(!jobDropOpen)}
              className="w-full flex items-center justify-between gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-medium hover:border-gray-300 transition shadow-sm"
            >
              <span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-gray-400" />{selectedJobLabel}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {jobDropOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-lg p-2 z-50">
                {[{ id: "all", title: "All positions" }, ...orgJobs].map((j) => (
                  <button
                    key={j.id}
                    onClick={() => { setSelectedJobId(j.id); setJobDropOpen(false); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${selectedJobId === j.id ? "bg-gray-900 text-white font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    {j.title}
                  </button>
                ))}
              </div>
            )}
            {jobDropOpen && <div className="fixed inset-0 z-40" onClick={() => setJobDropOpen(false)} />}
          </div>

          {/* Status tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {STATUS_TABS.map(({ value, label }) => {
              const count = value === "all" ? orgApplications.length : orgApplications.filter((a) => a.status === value).length;
              return (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filter === value ? "bg-[#FF0078] text-white border-[#FF0078]" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}
                >
                  {label} <span className={filter === value ? "text-white/60" : "text-gray-400"}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Applicant list */}
          <div className="flex-1 md:overflow-y-auto space-y-2 max-h-[40vh] overflow-y-auto md:max-h-none pr-0.5">
            {filtered.length === 0 ? (
              <div className="text-center py-14 text-gray-400">
                <Users className="w-7 h-7 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">{t("empty_noResults")}</p>
              </div>
            ) : filtered.map((app) => {
              const job = jobMap.get(app.jobId);
              const score = job && app.studentSkills ? computeMatchScore(job.tags, app.studentSkills) : null;
              const isSelected = app.id === (selectedApp?.id ?? "");

              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`bg-white border-l-4 border rounded-xl p-4 cursor-pointer transition-all ${STATUS_COLOR[app.status]} ${isSelected ? "border-r-gray-900 border-t-gray-900 border-b-gray-900 shadow-sm" : "border-t-gray-100 border-r-gray-100 border-b-gray-100 hover:border-t-gray-300 hover:border-r-gray-300 hover:border-b-gray-300"}`}
                >
                  <div className="flex items-start gap-3">
                    <img src={app.studentAvatar} alt={app.studentName} className="w-9 h-9 rounded-full border border-gray-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-gray-900 truncate">{app.studentName}</p>
                            {app.studentIknowVerified && <ShieldCheck className="w-3.5 h-3.5 text-[#FF0078] shrink-0" />}
                          </div>
                          <p className="text-xs text-gray-400 truncate">{app.studentMajor} · {app.studentUniversity}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          {score !== null && (
                            <span className={`text-xs font-bold flex items-center gap-0.5 ${score >= 60 ? "text-emerald-600" : "text-[#FF0078]"}`}>
                              <Zap className="w-3 h-3" />{score}%
                            </span>
                          )}
                          <AppStatusBadge status={app.status} />
                        </div>
                      </div>
                      {app.studentSkills && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {app.studentSkills.slice(0, 3).map((s) => (
                            <span key={s} className="text-[10px] px-1.5 py-0.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-full">{s}</span>
                          ))}
                          {app.studentSkills.length > 3 && (
                            <span className="text-[10px] text-gray-400">+{app.studentSkills.length - 3}</span>
                          )}
                        </div>
                      )}
                      <p className="text-[10px] text-gray-300 mt-2">{formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Candidate detail panel */}
        {selectedApp ? (
          <div className="w-full md:w-[62%] bg-white border border-gray-200 rounded-2xl flex flex-col md:min-h-0 overflow-hidden">

            {/* Header */}
            <div className="px-6 pt-6 pb-5 border-b border-gray-100 shrink-0">
              <div className="flex items-start gap-4">
                <img src={selectedApp.studentAvatar} alt={selectedApp.studentName} className="w-14 h-14 rounded-full border border-gray-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h2 className="text-xl font-bold text-gray-900">{selectedApp.studentName}</h2>
                    {selectedApp.studentIknowVerified && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-[#FF0078] bg-[#FF0078]/10 border border-[#FF0078]/20 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3" /> Verified via iKnow
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{selectedApp.studentMajor} · {selectedApp.studentUniversity}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {selectedApp.studentYear && (
                      <span className="text-xs text-gray-400 flex items-center gap-1"><BookOpen className="w-3 h-3" />{selectedApp.studentYear}</span>
                    )}
                    {selectedApp.studentGpa && (
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Star className="w-3 h-3" />GPA {selectedApp.studentGpa}</span>
                    )}
                    {selectedApp.studentAvailability && (
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{selectedApp.studentAvailability}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {selectedApp.studentLinkedin && (
                      <a href={`https://${selectedApp.studentLinkedin}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />LinkedIn
                      </a>
                    )}
                    {selectedApp.studentGithub && (
                      <a href={`https://${selectedApp.studentGithub}`} target="_blank" rel="noreferrer" className="text-xs text-gray-600 hover:underline flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />GitHub
                      </a>
                    )}
                    {selectedJob && (
                      <span className="text-xs text-gray-400 flex items-center gap-1 ml-1">
                        <Briefcase className="w-3 h-3" /> Applied for <span className="font-medium text-gray-600">{selectedJob.title}</span>
                      </span>
                    )}
                  </div>
                </div>
                {/* Match score */}
                {matchScore !== null && (
                  <div className={`shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-2xl border-2 ${matchScore >= 60 ? "border-emerald-200 bg-emerald-50" : "border-[#FF0078]/20 bg-[#FF0078]/5"}`}>
                    <Zap className={`w-4 h-4 mb-0.5 ${matchScore >= 60 ? "text-emerald-600" : "text-[#FF0078]"}`} />
                    <span className={`text-lg font-extrabold leading-none ${matchScore >= 60 ? "text-emerald-600" : "text-[#FF0078]"}`}>{matchScore}%</span>
                    <span className="text-[9px] text-gray-400 mt-0.5">match</span>
                  </div>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">

              {/* Actions */}
              {!isDone(selectedApp.status) && (
                <div className="px-6 py-4 flex items-center gap-3">
                  <button
                    onClick={() => reject(selectedApp.id)}
                    className="flex items-center gap-1.5 text-sm font-medium text-red-500 border border-red-100 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
                  >
                    <XCircle className="w-4 h-4" /> {t("btn_reject")}
                  </button>
                  {NEXT_STATUS[selectedApp.status] && (
                    <button
                      onClick={() => advance(selectedApp.id, selectedApp.status)}
                      className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#FF0078] hover:bg-[#d60065] px-5 py-2 rounded-lg transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" /> {NEXT_LABEL[selectedApp.status]}
                    </button>
                  )}
                  <AppStatusBadge status={selectedApp.status} />
                </div>
              )}
              {isDone(selectedApp.status) && (
                <div className="px-6 py-4 flex items-center gap-2">
                  <AppStatusBadge status={selectedApp.status} />
                  <span className="text-xs text-gray-400">{selectedApp.status === "offered" ? t("label_offerSent") : t("label_archived")}</span>
                </div>
              )}

              {/* Fit breakdown */}
              {selectedJob && (matchedSkills.length > 0 || missingSkills.length > 0) && (
                <div className="px-6 py-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Fit Breakdown</p>
                  <div className="space-y-2">
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
              )}

              {/* Bio */}
              {selectedApp.studentBio && (
                <div className="px-6 py-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">About</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedApp.studentBio}</p>
                </div>
              )}

              {/* Cover note */}
              {selectedApp.coverNote && (
                <div className="px-6 py-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Cover Note</p>
                  <p className="text-sm text-gray-600 leading-relaxed italic">"{selectedApp.coverNote}"</p>
                </div>
              )}

              {/* Skills */}
              {selectedApp.studentSkills && selectedApp.studentSkills.length > 0 && (
                <div className="px-6 py-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.studentSkills.map((s) => (
                      <span key={s} className={`text-xs px-2.5 py-1 rounded-full border font-medium ${matchedSkills.includes(s) ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {selectedApp.studentProjects && selectedApp.studentProjects.length > 0 && (
                <div className="px-6 py-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Projects</p>
                  <div className="space-y-3">
                    {selectedApp.studentProjects.map((p) => (
                      <div key={p.id} className="bg-gray-50 border border-gray-100 rounded-xl p-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                          {p.link && (
                            <a href={p.link} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-700 shrink-0 transition-colors">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{p.description}</p>
                        {p.skills && (
                          <div className="flex gap-1.5 mt-2 flex-wrap">
                            {p.skills.map((s) => <span key={s} className="text-[10px] px-1.5 py-0.5 bg-white border border-gray-200 text-gray-500 rounded-full">{s}</span>)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interests */}
              {selectedApp.studentInterests && selectedApp.studentInterests.length > 0 && (
                <div className="px-6 py-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    <span className="flex items-center gap-1.5"><Lightbulb className="w-3.5 h-3.5" />Interests</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.studentInterests.map((i) => (
                      <span key={i} className="text-xs px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-200 rounded-full font-medium">{i}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden md:flex w-full md:w-[62%] bg-white border border-gray-200 rounded-2xl items-center justify-center">
            <div className="text-center text-gray-400">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <p className="text-sm">Select an applicant to view their profile</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
