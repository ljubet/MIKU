export type Role = "student" | "org";
export type AccountType = "candidate" | "provider";

export interface StudentProject {
  id: string;
  name: string;
  description: string;
  link?: string;
  skills?: string[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  iknow_verified?: boolean;
  university: string;
  major: string;
  year: string;
  gpa?: string;
  bio: string;
  skills: string[];
  projects?: StudentProject[];
  interests?: string[];
  availability?: string;
  linkedin?: string;
  github?: string;
  resume?: string;
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  logo?: string;
  industry: string;
  size: string;
  location: string;
  website?: string;
  description: string;
  founded?: string;
  verified: boolean;
  hiresCount: number;
  responseTime: string; // e.g. "Usually responds in 2–3 days"
  activeThisWeek: boolean;
}

export type JobType = "internship" | "full-time" | "part-time" | "remote";
export type JobStatus = "open" | "closed" | "draft";

export interface HiringStage {
  step: number;
  label: string;
  description: string;
}

export interface Job {
  id: string;
  orgId: string;
  orgName: string;
  orgLogo?: string;
  title: string;
  type: JobType;
  location: string;
  remote: boolean;
  salary?: string;
  description: string;
  requirements: string[];
  tags: string[];
  status: JobStatus;
  postedAt: string;
  deadline?: string;
  daysUntilDeadline?: number;
  applicantCount: number;
  // New trust + intelligence fields
  hiringProcess: HiringStage[];
  timeline: string;        // e.g. "2–3 weeks from application to offer"
  matchScore?: number;     // 0–100, computed per student
  verified: boolean;
  featured?: boolean;
}

export type ApplicationStatus =
  | "applied"
  | "shortlisted"
  | "reviewing"
  | "interview"
  | "offered"
  | "rejected";

export interface Application {
  id: string;
  jobId: string;
  orgId?: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentUniversity: string;
  studentMajor: string;
  studentAvatar?: string;
  studentSkills?: string[];
  studentProjects?: StudentProject[];
  studentInterests?: string[];
  studentAvailability?: string;
  studentBio?: string;
  studentGpa?: string;
  studentYear?: string;
  studentLinkedin?: string;
  studentGithub?: string;
  studentIknowVerified?: boolean;
  coverNote?: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
}
