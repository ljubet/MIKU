import { createClient } from './client'
import { Job, Organization } from '@/types'

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

  if (error) {
    console.error('[fetchJobs]', error.message)
    return []
  }

  return (data ?? []).map(mapJob)
}

export async function fetchOrganizations(): Promise<Organization[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .order('name')

  if (error) {
    console.error('[fetchOrganizations]', error.message)
    return []
  }

  return (data ?? []).map(mapOrg)
}
