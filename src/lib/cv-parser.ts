"use client";

import { StudentProject } from "@/types";

export type CVParsedProfile = {
  fullName?: string;
  headline?: string;
  skills: string[];
  projects: StudentProject[];
  interests?: string[];
  experience?: string[];
  education?: string[];
  availability?: string;
};

export type CVInsights = {
  strengths: string[];
  gaps: string[];
  suggestions: string[];
  missingInfo: string[];
};

export type CVScanResult = {
  profile: CVParsedProfile;
  insights: CVInsights;
};

const MOCK_RESULT: CVScanResult = {
  profile: {
    fullName: "Sara Nikolovska",
    headline: "Frontend Engineer · React / TypeScript",
    skills: ["React", "TypeScript", "Next.js", "Tailwind", "Figma"],
    projects: [
      {
        id: "cv-p1",
        name: "Design Systems Portal",
        description: "Built a reusable UI library with Storybook and Tailwind.",
        link: "https://github.com/saranikolovska/design-system",
        skills: ["React", "Storybook", "Tailwind"],
      },
      {
        id: "cv-p2",
        name: "Internship Tracker",
        description: "Created a dashboard to track internship applications and follow-ups.",
        link: "https://github.com/saranikolovska/internship-tracker",
        skills: ["Next.js", "Supabase"],
      },
    ],
    interests: ["Product design", "Accessibility", "EdTech"],
    experience: [
      "Frontend Intern · BrightLabs (2024)",
      "Freelance UI Designer · Self-employed (2023)",
    ],
    education: [
      "BSc Computer Science · Ss. Cyril and Methodius University",
    ],
    availability: undefined,
  },
  insights: {
    strengths: [
      "Strong frontend skill set",
      "Hands-on product experience with real projects",
    ],
    gaps: [
      "No project links detected",
      "Limited backend exposure",
    ],
    suggestions: [
      "Add more specific technologies (e.g. Zustand, Jest)",
      "Include measurable impact for each project",
    ],
    missingInfo: ["Missing availability information", "No portfolio link included"],
  },
};

export async function mockParseCv(_: File): Promise<CVScanResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_RESULT);
    }, 1400);
  });
}
