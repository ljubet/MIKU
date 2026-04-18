"use client";

import { Job } from "@/types";
import { useApp } from "@/lib/app-context";
import { computeMatchScore } from "@/lib/mock-data";
import { JobTypeBadge } from "./StatusBadge";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Bookmark,
  BookmarkCheck,
  Clock,
  Users,
  Wifi,
  ShieldCheck,
  Zap,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface JobCardProps {
  job: Job;
  onClick?: () => void;
  compact?: boolean;
}

function MatchScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : score >= 60
      ? "bg-[#FF0078]/10 text-[#FF0078] border-[#FF0078]/30"
      : "bg-gray-50 text-gray-500 border-gray-200";

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${color}`}
    >
      <Zap className="w-3 h-3" />
      {score}% match
    </span>
  );
}

export function JobCard({ job, onClick, compact = false }: JobCardProps) {
  const { savedJobs, toggleSave, hasApplied, currentStudent } = useApp();
  const saved = savedJobs.includes(job.id);
  const applied = hasApplied(job.id);
  const matchScore = computeMatchScore(job.tags, currentStudent.skills);

  const isUrgent = job.daysUntilDeadline !== undefined && job.daysUntilDeadline <= 7;
  const orgData = {
    verified: job.verified,
    responseTime: "Responds in 2–3 days", // pulled from org in real app
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white border border-gray-100 rounded-xl p-5 hover:border-[#FF0078]/30 hover:shadow-md transition-all duration-200 cursor-pointer relative"
    >
      {/* Featured glow */}
      {job.featured && (
        <div className="absolute inset-0 rounded-xl ring-1 ring-violet-200 pointer-events-none" />
      )}

      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="w-11 h-11 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
          {job.orgLogo ? (
            <img src={job.orgLogo} alt={job.orgName} className="w-8 h-8" />
          ) : (
            <span className="text-sm font-bold text-gray-500">{job.orgName[0]}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Top row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {/* Org name + verified */}
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="text-xs text-gray-400 font-medium">{job.orgName}</p>
                {job.verified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF0078] shrink-0" />
                )}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-[#FF0078] transition-colors">
                {job.title}
              </h3>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSave(job.id);
              }}
              className="text-gray-300 hover:text-[#FF0078] transition-colors shrink-0 mt-0.5"
            >
              {saved ? (
                <BookmarkCheck className="w-4 h-4 text-[#FF0078]" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            <JobTypeBadge type={job.type} />
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="w-3 h-3" />
              {job.location}
            </span>
            {job.remote && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Wifi className="w-3 h-3" />
                Remote OK
              </span>
            )}
            {job.salary && (
              <span className="text-xs font-semibold text-gray-700">{job.salary}</span>
            )}
          </div>

          {/* Description */}
          {!compact && (
            <p className="text-xs text-gray-500 mt-2.5 line-clamp-2 leading-relaxed">
              {job.description}
            </p>
          )}

          {/* Skill tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {job.tags.slice(0, 4).map((tag) => {
              const isMatch = currentStudent.skills
                .map((s) => s.toLowerCase())
                .includes(tag.toLowerCase());
              return (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={`text-xs px-2 py-0 ${
                    isMatch
                      ? "bg-[#FF0078]/10 text-[#FF0078] border border-[#FF0078]/20"
                      : "bg-gray-50 text-gray-500"
                  }`}
                >
                  {tag}
                </Badge>
              );
            })}
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {job.applicantCount} applied
              </span>
              {isUrgent && job.daysUntilDeadline !== undefined && (
                <span className="flex items-center gap-1 text-amber-600 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  Closes in {job.daysUntilDeadline}d
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {applied ? (
                <Badge
                  variant="outline"
                  className="text-xs bg-green-50 text-green-700 border-green-200"
                >
                  Applied ✓
                </Badge>
              ) : (
                <MatchScoreBadge score={matchScore} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
