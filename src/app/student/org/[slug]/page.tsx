"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { useLang } from "@/lib/language-context";
import { computeMatchScore } from "@/lib/match";
import { mockOrgReviews } from "@/lib/mock-data";
import { JobDetailPanel } from "@/components/shared/JobDetailPanel";
import { Job } from "@/types";
import {
  ArrowLeft, ShieldCheck, MapPin, Users, Globe, Calendar,
  Zap, CheckCircle2, Clock, Bookmark, BookmarkCheck,
  AlertCircle, Building2, Star,
} from "lucide-react";

const TYPE_STYLES: Record<string, string> = {
  internship: "bg-[#FF0078]/10 text-[#FF0078] border-[#FF0078]/30",
  "full-time": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "part-time": "bg-orange-50 text-orange-700 border-orange-200",
};

export default function OrgProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const orgName = decodeURIComponent(slug);
  const router = useRouter();
  const { organizations, jobs, savedJobs, toggleSave, currentStudent } = useApp();
  const { t } = useLang();

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const org = organizations.find((o) => o.name === orgName);
  const orgJobs = jobs.filter((j) => j.orgName === orgName && j.status === "open");
  const orgReviews = org ? mockOrgReviews.filter((r) => r.organizationId === org.id) : [];

  if (!org) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center text-gray-400">
        <Building2 className="w-10 h-10 mb-3 opacity-20" />
        <p className="text-sm font-medium text-gray-600">Organization not found</p>
        <button onClick={() => router.back()} className="mt-4 text-xs text-[#FF0078] hover:underline">← Go back</button>
      </div>
    );
  }

  const logo = org.logo || (org as any).avatar;

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
              {logo ? (
                <img src={logo} alt={org.name} className="w-12 h-12 object-contain" />
              ) : (
                <span className="text-2xl font-bold text-gray-300">{org.name[0]}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{org.name}</h1>
                {org.verified && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#FF0078] bg-[#FF0078]/10 border border-[#FF0078]/20 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" /> {t("label_verified")}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{org.industry}</p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{org.location}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{org.size} {t("label_employees")}</span>
                {org.founded && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Est. {org.founded}</span>}
                {org.website && (
                  <a href={`https://${org.website}`} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-[#FF0078] hover:underline font-medium">
                    <Globe className="w-3.5 h-3.5" />{org.website}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed mt-5 pt-5 border-t border-gray-100">
            {org.description}
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-100">
            {org.hiresCount > 0 && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                <p className="text-xl font-extrabold text-emerald-700">{org.hiresCount}</p>
                <p className="text-xs text-emerald-600 mt-0.5">{t("label_studentsHired")}</p>
              </div>
            )}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
              <p className="text-xl font-extrabold text-gray-800">{orgJobs.length}</p>
              <p className="text-xs text-gray-500 mt-0.5">Open positions</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
              <p className="text-xs font-semibold text-gray-700 mt-1 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />{org.responseTime}
              </p>
            </div>
          </div>
        </div>

        {/* Open positions */}
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3">
            Open positions <span className="text-gray-400 font-normal text-sm">({orgJobs.length})</span>
          </h2>

          {orgJobs.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-gray-400">
              <Building2 className="w-7 h-7 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No open positions right now</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orgJobs.map((job) => {
                const score = computeMatchScore(job.tags, currentStudent.skills);
                const isSaved = savedJobs.includes(job.id);
                const urgent = job.daysUntilDeadline !== undefined && job.daysUntilDeadline <= 7;

                return (
                  <div
                    key={job.id}
                    onClick={() => { setSelectedJob(job); setPanelOpen(true); }}
                    className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-gray-400 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-900 text-sm">{job.title}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${TYPE_STYLES[job.type] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                            {job.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 flex-wrap">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                          {job.salary && <span className="font-medium text-gray-600">{job.salary}</span>}
                          {urgent && (
                            <span className="text-amber-600 font-medium flex items-center gap-0.5">
                              <AlertCircle className="w-3 h-3" />{job.daysUntilDeadline}{t("label_daysLeft")}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          {job.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-gray-50 border border-gray-200 text-gray-500 rounded-full">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={`text-xs font-bold flex items-center gap-0.5 ${score >= 60 ? "text-emerald-600" : "text-[#FF0078]"}`}>
                          <Zap className="w-3 h-3" />{score}%
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSave(job.id); }}
                          className="text-gray-300 hover:text-gray-600 transition-colors"
                        >
                          {isSaved ? <BookmarkCheck className="w-4 h-4 text-[#FF0078]" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reviews */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">
              Reviews <span className="text-gray-400 font-normal text-sm">({orgReviews.length})</span>
            </h2>
            {orgReviews.length > 0 && (
              <div className="flex items-center gap-1.5 text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-gray-800">
                  {(orgReviews.reduce((acc, r) => acc + r.rating, 0) / orgReviews.length).toFixed(1)}
                </span>
                <span className="text-gray-400">/ 5</span>
              </div>
            )}
          </div>

          {orgReviews.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-gray-400">
              <Star className="w-7 h-7 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orgReviews.map((review) => (
                <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-gray-500">{review.reviewerName[0]}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-gray-900">{review.reviewerName}</p>
                          {review.isVerifiedWorker && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-[#FF0078] bg-[#FF0078]/10 border border-[#FF0078]/20 px-1.5 py-0.5 rounded-full">
                              <ShieldCheck className="w-2.5 h-2.5" /> Verified Worker
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{review.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mt-3">{review.reviewText}</p>
                  {review.createdAt && (
                    <p className="text-xs text-gray-300 mt-2">
                      {new Date(review.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <JobDetailPanel
        job={selectedJob}
        open={panelOpen}
        onClose={() => { setPanelOpen(false); setSelectedJob(null); }}
      />
    </>
  );
}
