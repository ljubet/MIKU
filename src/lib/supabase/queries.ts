import { createClient } from './client'
import { Application, Job, Organization, Student } from '@/types'
import { mockJobs, mockOrganizations } from '@/lib/mock-data'

// Generates dicebear logo URL from org name — same pattern as the original mock data
function orgLogoUrl(name: string): string {
  const seed = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapJob(row: any): Job {
  return {
    id: row.id,
    orgId: row.org_id,
    orgName: row.organizations?.name ?? '',
    orgLogo: orgLogoUrl(row.organizations?.name ?? ''),
    title: row.title,
    type: row.type,
    location: row.location,
    remote: row.remote ?? false,
    salary: row.salary,
    description: row.description ?? '',
    requirements: row.requirements ?? [],
    tags: row.tags ?? [],
    hiringProcess: row.hiring_process ?? [],
    timeline: row.timeline ?? '',
    deadline: row.deadline,
    daysUntilDeadline: row.days_until_deadline,
    applicantCount: row.applicant_count ?? 0,
    status: row.status,
    verified: row.verified ?? false,
    featured: row.featured ?? false,
    postedAt: row.posted_at,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapOrg(row: any): Organization {
  return {
    id: row.id,
    name: row.name,
    email: row.email ?? '',
    industry: row.industry ?? '',
    size: row.size ?? '',
    location: row.location ?? '',
    description: row.description ?? '',
    website: row.website ?? undefined,
    founded: row.founded?.toString(),
    verified: row.verified ?? false,
    hiresCount: row.hires_count ?? 0,
    responseTime: row.response_time ?? '',
    activeThisWeek: true,
  }
}

export async function fetchJobs(): Promise<Job[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      organizations (
        id,
        name,
        verified
      )
    `)
    .eq('status', 'open')
    .order('posted_at', { ascending: false })

  if (error || !data?.length) return mockJobs

  return data.map(mapJob)
}

export async function fetchOrganizations(): Promise<Organization[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .order('name')

  if (error || !data?.length) return mockOrganizations

  return data.map(mapOrg)
}

export async function fetchStudentProfile(studentId: string): Promise<Student | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('id', studentId)
    .maybeSingle()

  if (error) {
    console.error('[fetchStudentProfile]', error.message)
    throw new Error(error.message)
  }

  if (!data) return null

  return {
    id: data.id,
    name: data.name ?? '',
    email: data.email ?? '',
    avatar: data.avatar ?? undefined,
    university: data.university ?? '',
    major: data.major ?? '',
    year: data.year ?? '',
    gpa: data.gpa ?? undefined,
    bio: data.bio ?? '',
    skills: data.skills ?? [],
    projects: data.projects ?? [],
    interests: data.interests ?? [],
    availability: data.availability ?? undefined,
    linkedin: data.linkedin ?? undefined,
    github: data.github ?? undefined,
  }
}

function mapApplication(row: any): Application {
  return {
    id: row.id,
    jobId: row.job_id,
    orgId: row.org_id ?? undefined,
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

export async function fetchStudentApplications(studentId: string): Promise<Application[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[fetchStudentApplications]', error.message)
    return []
  }

  return (data ?? []).map(mapApplication)
}

export async function fetchOrgApplications(orgId: string): Promise<Application[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[fetchOrgApplications]', error.message)
    return []
  }

  return (data ?? []).map(mapApplication)
}
