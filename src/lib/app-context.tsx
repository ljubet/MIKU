"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Role, Job, Organization, Application } from "@/types";
import { mockApplications, mockStudent, mockOrg } from "@/lib/mock-data";
import { fetchJobs, fetchOrganizations } from "@/lib/supabase/queries";

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  savedJobs: string[];
  toggleSave: (jobId: string) => void;
  applications: Application[];
  applyToJob: (job: Job, coverNote?: string) => void;
  hasApplied: (jobId: string) => boolean;
  currentStudent: typeof mockStudent;
  currentOrg: typeof mockOrg;
  jobs: Job[];
  organizations: Organization[];
  jobsLoading: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("student");
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchJobs(), fetchOrganizations()]).then(([j, o]) => {
      setJobs(j);
      setOrganizations(o);
      setJobsLoading(false);
    });
  }, []);

  const toggleSave = (jobId: string) => {
    setSavedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const hasApplied = (jobId: string) =>
    applications.some((a) => a.jobId === jobId);

  const applyToJob = (job: Job, coverNote?: string) => {
    if (hasApplied(job.id)) return;
    const newApp: Application = {
      id: `a${Date.now()}`,
      jobId: job.id,
      studentId: mockStudent.id,
      studentName: mockStudent.name,
      studentEmail: mockStudent.email,
      studentUniversity: mockStudent.university,
      studentMajor: mockStudent.major,
      studentAvatar: mockStudent.avatar,
      coverNote,
      status: "applied",
      appliedAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setApplications((prev) => [...prev, newApp]);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        savedJobs,
        toggleSave,
        applications,
        applyToJob,
        hasApplied,
        currentStudent: mockStudent,
        currentOrg: mockOrg,
        jobs,
        organizations,
        jobsLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
