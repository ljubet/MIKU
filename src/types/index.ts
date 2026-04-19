export type Role = "student" | "org";

export interface OrgReview {
  id: string;
  organizationId: string;
  reviewerName: string;
  role: string;
  rating: number; // 1–5
  reviewText: string;
  isVerifiedWorker: boolean;
  createdAt: string;
}
export type AccountType = "candidate" | "provider";

export interface StudentProject {
  id: string;
  name: string;
  description: string;
  link?: string;
  skills?: string[];
}

export type AchievementCategory =
  | "profile"
  | "verification"
  | "matching"
  | "activity"
  | "projects"
  | "competition";

export type AchievementIcon =
  | "sparkles"
  | "shield-check"
  | "zap"
  | "clock"
  | "rocket"
  | "medal"
  | "trophy"
  | "badge-check"
  | "calendar-check"
  | "target";

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  icon: AchievementIcon;
  category: AchievementCategory;
  earned: boolean;
  earnedAt?: string;
  highlighted?: boolean;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  iknow_verified?: boolean;
  headline?: string;
  university: string;
  major: string;
  year: string;
  gpa?: string;
  bio: string;
  skills: string[];
  projects?: StudentProject[];
  interests?: string[];
  experience?: string[];
  education?: string[];
  availability?: string;
  linkedin?: string;
  github?: string;
  resume?: string;
  achievements?: Achievement[];
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

export interface InterviewInsights {
  intro: string;
  interviewQuestions: string[];
  preparationTips: string[];
  interviewStages: string[];
}

export interface Job {
  id: string;
  orgId: string;
  orgName: string;
  orgLogo?: string;
  title: string;
  titleMk?: string;
  titleSq?: string;
  type: JobType;
  location: string;
  remote: boolean;
  salary?: string;
  description: string;
  descriptionMk?: string;
  descriptionSq?: string;
  requirements: string[];
  requirementsSq?: string[];
  tags: string[];
  status: JobStatus;
  postedAt: string;
  deadline?: string;
  daysUntilDeadline?: number;
  applicantCount: number;
  // New trust + intelligence fields
  hiringProcess: HiringStage[];
  hiringProcessSq?: HiringStage[];
  timeline: string;        // e.g. "2–3 weeks from application to offer"
  matchScore?: number;     // 0–100, computed per student
  verified: boolean;
  featured?: boolean;
  interviewInsights?: InterviewInsights;
  interviewInsightsMk?: InterviewInsights;
  interviewInsightsSq?: InterviewInsights;
}

export type ApplicationStatus =
  | "applied"
  | "shortlisted"
  | "reviewing"
  | "interview"
  | "interview_invited"
  | "interview_scheduled"
  | "interview_confirmed"
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
  studentAchievements?: Achievement[];
  coverNote?: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
}
