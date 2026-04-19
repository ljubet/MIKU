'use server'

import { createClient } from '@/lib/supabase/server'
import { Application, ApplicationStatus, Student } from '@/types'

const WEEKLY_APPLICATION_LIMIT = 7

type ApplicationQuota = {
  limit: number
  used: number
  remaining: number
  resetAt: string | null
}

function mapApplication(row: any): Application {
  return {
    id: row.id,
    jobId: row.job_id,
    orgId: row.org_id,
    studentId: row.student_id,
    studentName: row.student_name ?? '',
    studentEmail: row.student_email ?? '',
    studentUniversity: row.student_university ?? '',
    studentMajor: row.student_major ?? '',
    studentAvatar: row.student_avatar ?? undefined,
    studentSkills: row.student_skills ?? undefined,
    studentProjects: row.student_projects ?? undefined,
    studentInterests: row.student_interests ?? undefined,
    studentAvailability: row.student_availability ?? undefined,
    coverNote: row.cover_note ?? undefined,
    status: row.status,
    appliedAt: row.created_at ?? '',
    updatedAt: row.updated_at ?? row.created_at ?? '',
  }
}

async function getWeeklyUsage(studentId: string) {
  const supabase = await createClient()
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { count, error } = await supabase
    .from('applications')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', studentId)
    .gte('created_at', cutoff)

  if (error) {
    throw new Error(error.message)
  }

  return count ?? 0
}

async function getResetAt(studentId: string) {
  const supabase = await createClient()
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('applications')
    .select('created_at')
    .eq('student_id', studentId)
    .gte('created_at', cutoff)
    .order('created_at', { ascending: true })
    .limit(1)

  if (error) {
    throw new Error(error.message)
  }

  if (!data?.length) return null
  const oldest = new Date(data[0].created_at)
  return new Date(oldest.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
}

export async function getApplicationQuota(studentId: string): Promise<ApplicationQuota> {
  const used = await getWeeklyUsage(studentId)
  const remaining = Math.max(0, WEEKLY_APPLICATION_LIMIT - used)
  const resetAt = await getResetAt(studentId)
  return {
    limit: WEEKLY_APPLICATION_LIMIT,
    used,
    remaining,
    resetAt,
  }
}

export async function createApplication(input: {
  jobId: string
  orgId: string
  studentId: string
  coverNote?: string
}): Promise<{ application?: Application; reason?: 'limit' | 'duplicate' }> {
  const supabase = await createClient()
  const used = await getWeeklyUsage(input.studentId)

  if (used >= WEEKLY_APPLICATION_LIMIT) {
    return { reason: 'limit' }
  }

  const { count: existingCount, error: existingError } = await supabase
    .from('applications')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', input.studentId)
    .eq('job_id', input.jobId)

  if (existingError) {
    throw new Error(existingError.message)
  }

  if ((existingCount ?? 0) > 0) {
    return { reason: 'duplicate' }
  }

  const { data: profile, error: profileError } = await supabase
    .from('student_profiles')
    .select('name,email,university,major,avatar,skills,projects,interests,availability')
    .eq('id', input.studentId)
    .single()

  if (profileError) {
    throw new Error(profileError.message)
  }

  const payload = {
    job_id: input.jobId,
    org_id: input.orgId,
    student_id: input.studentId,
    student_name: profile?.name ?? '',
    student_email: profile?.email ?? '',
    student_university: profile?.university ?? '',
    student_major: profile?.major ?? '',
    student_avatar: profile?.avatar ?? null,
    student_skills: profile?.skills ?? [],
    student_projects: profile?.projects ?? [],
    student_interests: profile?.interests ?? [],
    student_availability: profile?.availability ?? null,
    cover_note: input.coverNote ?? null,
    status: 'applied',
  }

  const { data, error } = await supabase
    .from('applications')
    .insert(payload)
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return { application: mapApplication(data) }
}

export async function updateApplicationStatus(input: {
  applicationId: string
  status: ApplicationStatus
}): Promise<Application> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('applications')
    .update({ status: input.status, updated_at: new Date().toISOString() })
    .eq('id', input.applicationId)
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapApplication(data)
}

export async function upsertStudentProfile(profile: Student): Promise<Student> {
  const supabase = await createClient()
  const payload = {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    avatar: profile.avatar ?? null,
    university: profile.university,
    major: profile.major,
    year: profile.year,
    gpa: profile.gpa ?? null,
    bio: profile.bio,
    skills: profile.skills,
    projects: profile.projects ?? [],
    interests: profile.interests ?? [],
    availability: profile.availability ?? null,
    linkedin: profile.linkedin ?? null,
    github: profile.github ?? null,
  }

  const { data, error } = await supabase
    .from('student_profiles')
    .upsert(payload)
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Student
}
