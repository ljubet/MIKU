import { Language } from "@/lib/translations";
import { HiringStage, InterviewInsights, Job } from "@/types";

export const getJobTitle = (job: Job, lang: Language) => {
  if (lang === "mk" && job.titleMk) return job.titleMk;
  if (lang === "sq" && job.titleSq) return job.titleSq;
  return job.title;
};

export const getJobDescription = (job: Job, lang: Language) => {
  if (lang === "mk" && job.descriptionMk) return job.descriptionMk;
  if (lang === "sq" && job.descriptionSq) return job.descriptionSq;
  return job.description;
};

export const getJobRequirements = (job: Job, lang: Language) => {
  if (lang === "sq" && job.requirementsSq?.length) return job.requirementsSq;
  return job.requirements;
};

export const getJobHiringProcess = (job: Job, lang: Language): HiringStage[] => {
  if (lang === "sq" && job.hiringProcessSq?.length) return job.hiringProcessSq;
  return job.hiringProcess;
};

export const getJobInterviewInsights = (job: Job, lang: Language): InterviewInsights | undefined => {
  if (lang === "mk" && job.interviewInsightsMk) return job.interviewInsightsMk;
  if (lang === "sq" && job.interviewInsightsSq) return job.interviewInsightsSq;
  return job.interviewInsights;
};
