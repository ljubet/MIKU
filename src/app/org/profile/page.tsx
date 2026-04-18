"use client";

import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit3, MapPin, Globe, Users, Calendar, Building2, Clock, CheckCircle2 } from "lucide-react";

export default function OrgProfilePage() {
  const { currentOrg, jobs } = useApp();
  const orgJobs = jobs.filter((j) => j.orgId === currentOrg.id && j.status === "open");

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Edit3 className="w-3.5 h-3.5" />
          Edit
        </Button>
      </div>

      {/* Company card */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentOrg.name}`}
              alt={currentOrg.name}
              className="w-12 h-12 rounded-lg"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{currentOrg.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs text-gray-500">
                {currentOrg.industry}
              </Badge>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-5 leading-relaxed">{currentOrg.description}</p>

        <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-300" />
            <div>
              <p className="text-xs text-gray-400">Location</p>
              <p className="text-sm font-medium text-gray-900">{currentOrg.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-300" />
            <div>
              <p className="text-xs text-gray-400">Company size</p>
              <p className="text-sm font-medium text-gray-900">{currentOrg.size} employees</p>
            </div>
          </div>
          {currentOrg.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-300" />
              <div>
                <p className="text-xs text-gray-400">Website</p>
                <p className="text-sm font-medium text-gray-900">{currentOrg.website}</p>
              </div>
            </div>
          )}
          {currentOrg.founded && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-300" />
              <div>
                <p className="text-xs text-gray-400">Founded</p>
                <p className="text-sm font-medium text-gray-900">{currentOrg.founded}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active jobs */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Open positions ({orgJobs.length})
        </h3>
        {orgJobs.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Building2 className="w-6 h-6 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No open positions right now</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orgJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{job.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {job.location} · {job.salary}
                  </p>
                </div>
                <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                  Open
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900 leading-none">{currentOrg.hiresCount}</p>
            <p className="text-xs text-gray-400 mt-0.5">Students hired via Miku</p>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">{currentOrg.responseTime}</p>
            <p className="text-xs text-gray-400 mt-0.5">Response time</p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
        <p className="text-sm text-gray-600">{currentOrg.email}</p>
      </div>
    </div>
  );
}
