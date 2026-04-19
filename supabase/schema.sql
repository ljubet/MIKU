create table if not exists student_profiles (
  id uuid primary key,
  name text not null,
  email text not null,
  avatar text,
  university text,
  major text,
  year text,
  gpa text,
  bio text,
  skills text[] not null default '{}'::text[],
  projects jsonb not null default '[]'::jsonb,
  interests text[] not null default '{}'::text[],
  availability text,
  linkedin text,
  github text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_type where typname = 'application_status') then
    create type application_status as enum ('applied', 'shortlisted', 'reviewing', 'interview', 'offered', 'rejected');
  end if;
end $$;

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null,
  org_id uuid not null,
  student_id uuid not null references student_profiles(id),
  student_name text not null,
  student_email text not null,
  student_university text,
  student_major text,
  student_avatar text,
  student_skills text[] not null default '{}'::text[],
  student_projects jsonb not null default '[]'::jsonb,
  student_interests text[] not null default '{}'::text[],
  student_availability text,
  cover_note text,
  status application_status not null default 'applied',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists applications_student_id_idx on applications (student_id);
create index if not exists applications_org_id_idx on applications (org_id);
create index if not exists applications_created_at_idx on applications (created_at);

create table if not exists saved_jobs (
  student_id uuid not null references student_profiles(id),
  job_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (student_id, job_id)
);
