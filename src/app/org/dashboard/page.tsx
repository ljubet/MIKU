"use client";

import { useApp } from "@/lib/app-context";
import { useLang } from "@/lib/language-context";
import { mockOrgApplicants } from "@/lib/mock-data";
import { AppStatusBadge, JobTypeBadge } from "@/components/shared/StatusBadge";
import { List, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OrgDashboard() {
  const { currentOrg, jobs } = useApp();
  const { t } = useLang();

  const orgJobs = jobs.filter((j) => j.orgId === currentOrg.id);
  const totalApplicants = orgJobs.reduce((sum, j) => sum + j.applicantCount, 0);
  const openJobs = orgJobs.filter((j) => j.status === "open").length;
  const recentApplicants = mockOrgApplicants.slice(0, 4);

  const stats = [
    {
      label: t('stat_activeListings'),
      value: openJobs,
      icon: List,
      href: "/org/listings",
      color: "text-[#FF0078]",
      bg: "bg-[#FF0078]/10",
    },
    {
      label: t('stat_totalApplicants'),
      value: totalApplicants,
      icon: Users,
      href: "/org/applicants",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: t('stat_inInterview'),
      value: mockOrgApplicants.filter((a) => a.status === "interview").length,
      icon: TrendingUp,
      href: "/org/applicants",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('page_welcome')} {currentOrg.name} 👋
          </h1>
        </div>
        <Link href="/org/post" className="shrink-0">
          <Button className="bg-[#FF0078] hover:bg-[#d60065] gap-1.5 w-full sm:w-auto">
            {t('btn_postJob')}
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, href, color, bg }) => (
          <Link key={label} href={href}>
            <div className="bg-white border border-gray-100 rounded-xl p-5 hover:border-[#FF0078]/30 hover:shadow-sm transition-all">
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Your listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">{t('section_yourListings')}</h2>
          <Link href="/org/listings">
            <Button variant="ghost" size="sm" className="text-[#FF0078] text-xs">
              {t('btn_manageAll')}
            </Button>
          </Link>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-50">
          {orgJobs.map((job) => (
            <div key={job.id} className="flex items-center gap-4 px-5 py-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">{job.title}</p>
                  <JobTypeBadge type={job.type} />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{job.location}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Users className="w-3.5 h-3.5" />
                  {job.applicantCount}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    job.status === "open"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {job.status === "open" ? t('label_open') : t('label_closed')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent applicants */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">{t('section_recentApplicants')}</h2>
          <Link href="/org/applicants">
            <Button variant="ghost" size="sm" className="text-[#FF0078] text-xs">
              {t('btn_viewAll')}
            </Button>
          </Link>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-50">
          {recentApplicants.map((app) => {
            const job = jobs.find((j) => j.id === app.jobId);
            return (
              <div key={app.id} className="flex items-center gap-4 px-5 py-4">
                <img
                  src={app.studentAvatar}
                  alt={app.studentName}
                  className="w-9 h-9 rounded-full border border-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{app.studentName}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {app.studentMajor} · {t('label_appliedFor')} {job?.title}
                  </p>
                </div>
                <AppStatusBadge status={app.status} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
