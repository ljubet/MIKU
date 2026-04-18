"use client";

import { useApp } from "@/lib/app-context";
import { computeMatchScore } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Edit3,
  FileText,
  Star,
  Link2,
  GitBranch,
  Zap,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { currentStudent, applications, savedJobs, jobs } = useApp();

  const openJobs = jobs.filter((j) => j.status === "open");
  const topMatches = openJobs
    .map((j) => ({ job: j, score: computeMatchScore(j.tags, currentStudent.skills) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const completeness = [
    { label: "Name & university", done: !!currentStudent.name },
    { label: "Bio", done: !!currentStudent.bio },
    { label: "Skills added", done: currentStudent.skills.length > 0 },
    { label: "LinkedIn linked", done: !!currentStudent.linkedin },
    { label: "GitHub linked", done: !!currentStudent.github },
    { label: "Resume uploaded", done: false },
  ];
  const doneCount = completeness.filter((c) => c.done).length;
  const pct = Math.round((doneCount / completeness.length) * 100);

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <Button variant="outline" size="sm" className="gap-1.5 font-medium">
          <Edit3 className="w-3.5 h-3.5" />
          Edit
        </Button>
      </div>

      {/* Profile hero card */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {/* Top colour band */}
        <div className="h-16 bg-gradient-to-r from-violet-500 to-violet-600" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-8 mb-4">
            <img
              src={currentStudent.avatar}
              alt={currentStudent.name}
              className="w-16 h-16 rounded-full border-4 border-white shadow-sm"
            />
            <div className="pb-1">
              <h2 className="text-lg font-bold text-gray-900">{currentStudent.name}</h2>
              <p className="text-xs text-gray-400">{currentStudent.email}</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-5">{currentStudent.bio}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-0.5">University</p>
              <p className="text-xs font-semibold text-gray-800 leading-tight">
                {currentStudent.university}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-0.5">Major</p>
              <p className="text-xs font-semibold text-gray-800">{currentStudent.major}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-0.5">Year / GPA</p>
              <p className="text-xs font-semibold text-gray-800 flex items-center gap-1">
                {currentStudent.year}
                {currentStudent.gpa && (
                  <span className="flex items-center gap-0.5 text-yellow-500">
                    · <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {currentStudent.gpa}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Skills</h3>
          <span className="text-xs text-gray-400">{currentStudent.skills.length} added</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {currentStudent.skills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="bg-violet-50 text-violet-700 border border-violet-100 px-3 py-1 text-sm font-medium"
            >
              {skill}
            </Badge>
          ))}
          <button className="px-3 py-1 rounded-full text-xs border border-dashed border-gray-200 text-gray-400 hover:border-violet-300 hover:text-violet-500 transition-colors">
            + Add skill
          </button>
        </div>
      </div>

      {/* Top job matches based on skills */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-violet-600" />
            <h3 className="font-semibold text-gray-900">Your top matches right now</h3>
          </div>
          <Link href="/student/dashboard">
            <Button variant="ghost" size="sm" className="text-violet-600 text-xs font-medium gap-1">
              See all <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {topMatches.map(({ job, score }) => (
            <Link key={job.id} href="/student/dashboard">
              <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                  {job.orgLogo ? (
                    <img src={job.orgLogo} alt={job.orgName} className="w-6 h-6" />
                  ) : (
                    <span className="text-xs font-bold text-gray-400">{job.orgName[0]}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate group-hover:text-violet-700 transition-colors">
                    {job.title}
                  </p>
                  <p className="text-xs text-gray-400">{job.orgName} · {job.salary}</p>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                    score >= 80
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-violet-50 text-violet-700"
                  }`}
                >
                  <Zap className="w-3 h-3" />{score}%
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Links</h3>
        <div className="space-y-2.5">
          {currentStudent.linkedin && (
            <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-blue-50">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                <Link2 className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span className="text-sm text-blue-700 font-medium">{currentStudent.linkedin}</span>
              <CheckCircle2 className="w-4 h-4 text-blue-400 ml-auto" />
            </div>
          )}
          {currentStudent.github && (
            <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-gray-50">
              <div className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center">
                <GitBranch className="w-3.5 h-3.5 text-gray-700" />
              </div>
              <span className="text-sm text-gray-700 font-medium">{currentStudent.github}</span>
              <CheckCircle2 className="w-4 h-4 text-gray-400 ml-auto" />
            </div>
          )}
          <button className="flex items-center gap-3 py-2 px-3 rounded-lg border border-dashed border-gray-200 w-full group hover:border-violet-300 transition-colors">
            <div className="w-7 h-7 rounded-lg bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center group-hover:border-violet-300">
              <FileText className="w-3.5 h-3.5 text-gray-300 group-hover:text-violet-400" />
            </div>
            <span className="text-sm text-gray-400 group-hover:text-violet-500 transition-colors">
              Upload resume (PDF)
            </span>
          </button>
        </div>
      </div>

      {/* Profile completeness */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">Profile strength</h3>
          <span
            className={`text-sm font-bold ${
              pct >= 80 ? "text-emerald-600" : pct >= 60 ? "text-violet-600" : "text-amber-500"
            }`}
          >
            {pct}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
          <div
            className={`h-2 rounded-full transition-all ${
              pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-violet-500" : "bg-amber-400"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="space-y-2">
          {completeness.map(({ label, done }) => (
            <div key={label} className="flex items-center gap-2.5 text-sm">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                  done ? "bg-emerald-100" : "bg-gray-100"
                }`}
              >
                {done ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                )}
              </div>
              <span className={done ? "text-gray-600" : "text-gray-400"}>{label}</span>
            </div>
          ))}
        </div>
        {!completeness.find((c) => c.label === "Resume uploaded")?.done && (
          <p className="text-xs text-violet-600 font-medium mt-4 bg-violet-50 rounded-lg px-3 py-2">
            💡 Adding your resume increases your response rate by 3×
          </p>
        )}
      </div>
    </div>
  );
}
