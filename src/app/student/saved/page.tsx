"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { useLang } from "@/lib/language-context";
import { JobCard } from "@/components/shared/JobCard";
import { JobDetailPanel } from "@/components/shared/JobDetailPanel";
import { Job } from "@/types";
import { Bookmark, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SavedPage() {
  const { savedJobs, jobs } = useApp();
  const { t } = useLang();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const saved = jobs.filter((j) => savedJobs.includes(j.id));

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('nav_savedJobs')}</h1>
          <p className="text-gray-400 text-sm mt-1">
            {saved.length} {t('btn_saved').toLowerCase()} {saved.length === 1 ? '' : ''}
          </p>
        </div>

        {saved.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-7 h-7 text-gray-300" />
            </div>
            <p className="font-semibold text-gray-700">{t('empty_noResults')}</p>
            <p className="text-sm text-gray-400 mt-1 mb-6">
              {t('empty_noResultsHint')}
            </p>
            <Link href="/student/dashboard">
              <Button size="sm" className="bg-[#FF0078] hover:bg-[#d60065] gap-1.5">
                {t('landing_browseBtn')} <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {saved.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => {
                  setSelectedJob(job);
                  setPanelOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <JobDetailPanel
        job={selectedJob}
        open={panelOpen}
        onClose={() => { setPanelOpen(false); setSelectedJob(null); }}
      />
    </>
  );
}
