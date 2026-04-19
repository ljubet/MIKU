"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Application, Job, Organization, Role, Student } from "@/types";
import { mockStudent, mockOrg, mockJobs, mockOrganizations, mockApplications, mockOrgApplicants } from "@/lib/mock-data";

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  savedJobs: string[];
  toggleSave: (jobId: string) => void;
  applications: Application[];
  applicationsLoading: boolean;
  applyToJob: (job: Job) => Promise<{ ok: boolean; reason?: "limit" | "duplicate" }>;
  cancelApplication: (jobId: string) => Promise<void>;
  hasApplied: (jobId: string) => boolean;
  currentStudent: Student;
  profileStatus: "loading" | "ready" | "missing" | "error";
  updateStudentProfile: (profile: Student) => Promise<void>;
  applicationQuota: {
    limit: number;
    used: number;
    remaining: number;
    resetAt: string | null;
  } | null;
  refreshApplicationQuota: () => Promise<void>;
  currentOrg: typeof mockOrg;
  jobs: Job[];
  organizations: Organization[];
  jobsLoading: boolean;
  orgApplications: Application[];
  orgApplicationsLoading: boolean;
  setOrgApplicationStatus: (applicationId: string, status: Application["status"]) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

const WEEKLY_LIMIT = 7;

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("student");
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [orgApplications, setOrgApplications] = useState<Application[]>(mockOrgApplicants);
  const [currentStudent, setCurrentStudent] = useState<Student>(mockStudent);
  const [profileStatus, setProfileStatus] = useState<"loading" | "ready" | "missing" | "error">("ready");
  const [applicationQuota, setApplicationQuota] = useState({
    limit: WEEKLY_LIMIT,
    used: mockApplications.length,
    remaining: WEEKLY_LIMIT - mockApplications.length,
    resetAt: null as string | null,
  });

  // Read mock user from localStorage (set at login)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("mock_user");
      if (raw) {
        const { name, email, accountType } = JSON.parse(raw);
        setCurrentStudent((prev) => ({
          ...prev,
          name: name || prev.name,
          email: email || prev.email,
        }));
        if (accountType === "provider") setRole("org");
      }
    } catch {}
  }, []);

  const refreshApplicationQuota = async () => {
    setApplicationQuota({
      limit: WEEKLY_LIMIT,
      used: applications.length,
      remaining: Math.max(0, WEEKLY_LIMIT - applications.length),
      resetAt: null,
    });
  };

  const toggleSave = (jobId: string) => {
    setSavedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const hasApplied = (jobId: string) => applications.some((a) => a.jobId === jobId);

  const applyToJob = async (job: Job) => {
    if (hasApplied(job.id)) return { ok: false, reason: "duplicate" as const };
    if (applicationQuota.remaining <= 0) return { ok: false, reason: "limit" as const };

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      orgId: job.orgId,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      studentEmail: currentStudent.email,
      studentUniversity: currentStudent.university,
      studentMajor: currentStudent.major,
      studentAvatar: currentStudent.avatar,
      studentSkills: currentStudent.skills,
      studentAchievements: currentStudent.achievements,
      status: "applied",
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setApplications((prev) => [newApp, ...prev]);
    setApplicationQuota((prev) => ({
      ...prev,
      used: prev.used + 1,
      remaining: Math.max(0, prev.remaining - 1),
    }));

    return { ok: true };
  };

  const cancelApplication = async (jobId: string) => {
    setApplications((prev) => prev.filter((app) => app.jobId !== jobId));
    setApplicationQuota((prev) => ({
      ...prev,
      used: Math.max(0, prev.used - 1),
      remaining: Math.min(WEEKLY_LIMIT, prev.remaining + 1),
    }));
  };

  const updateStudentProfile = async (profile: Student) => {
    setCurrentStudent(profile);
    setProfileStatus("ready");
  };

  const setOrgApplicationStatus = async (applicationId: string, status: Application["status"]) => {
    setOrgApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId ? { ...app, status, updatedAt: new Date().toISOString() } : app
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        savedJobs,
        toggleSave,
        applications,
        applicationsLoading: false,
        applyToJob,
        cancelApplication,
        hasApplied,
        currentStudent,
        profileStatus,
        updateStudentProfile,
        applicationQuota,
        refreshApplicationQuota,
        currentOrg: mockOrg,
        jobs: mockJobs,
        organizations: mockOrganizations,
        jobsLoading: false,
        orgApplications,
        orgApplicationsLoading: false,
        setOrgApplicationStatus,
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
