"use client";

import { useApp } from "@/lib/app-context";
import { JobTypeBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Edit3, Trash2, Plus } from "lucide-react";
import Link from "next/link";

export default function ListingsPage() {
  const { currentOrg, jobs } = useApp();
  const orgJobs = jobs.filter((j) => j.orgId === currentOrg.id);
  const otherJobs = jobs.filter((j) => j.orgId !== currentOrg.id);

  const allListings = [...orgJobs, ...otherJobs]; // Show all for demo

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Listings</h1>
          <p className="text-gray-400 text-sm mt-1">
            {orgJobs.length} active {orgJobs.length === 1 ? "listing" : "listings"}
          </p>
        </div>
        <Link href="/org/post">
          <Button className="bg-violet-600 hover:bg-violet-700 gap-1.5">
            <Plus className="w-4 h-4" />
            Post a Job
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {allListings.map((job) => (
          <div
            key={job.id}
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
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{job.title}</h3>
                      <JobTypeBadge type={job.type} />
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          job.status === "open"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {job.orgName} · {job.location}
                      {job.salary && ` · ${job.salary}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
                      <Edit3 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {job.applicantCount} applicants
                  </span>
                  {job.deadline && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Deadline: {job.deadline}
                    </span>
                  )}
                  <span>Posted {job.postedAt}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
