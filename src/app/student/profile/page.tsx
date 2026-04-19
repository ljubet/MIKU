"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/app-context";
import { useLang } from "@/lib/language-context";
import { computeMatchScore } from "@/lib/match";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Edit3,
  Star,
  Link2,
  GitBranch,
  Zap,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { Student, StudentProject } from "@/types";

export default function ProfilePage() {
  const { currentStudent, jobs, updateStudentProfile, profileStatus } = useApp();
  const { t } = useLang();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<Student>(currentStudent);
  const [skillsInput, setSkillsInput] = useState(currentStudent.skills.join(", "));
  const [interestsInput, setInterestsInput] = useState(
    currentStudent.interests?.join(", ") ?? ""
  );
  const [projects, setProjects] = useState<StudentProject[]>(currentStudent.projects ?? []);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    link: "",
    skills: "",
  });

  useEffect(() => {
    setDraft(currentStudent);
    setSkillsInput(currentStudent.skills.join(", "));
    setInterestsInput(currentStudent.interests?.join(", ") ?? "");
    setProjects(currentStudent.projects ?? []);
  }, [currentStudent]);

  const openJobs = jobs.filter((j) => j.status === "open");
  const topMatches = openJobs
    .map((j) => ({ job: j, score: computeMatchScore(j.tags, currentStudent.skills) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const completeness = [
    { label: t('profile_nameUniversity'), done: !!currentStudent.name },
    { label: t('profile_bio'), done: !!currentStudent.bio },
    { label: t('profile_skillsAdded'), done: currentStudent.skills.length > 0 },
    { label: t('profile_linkedinLinked'), done: !!currentStudent.linkedin },
    { label: t('profile_githubLinked'), done: !!currentStudent.github },
    { label: t('profile_projectsAdded'), done: (currentStudent.projects?.length ?? 0) > 0 },
    { label: t('profile_interestsAdded'), done: (currentStudent.interests?.length ?? 0) > 0 },
    { label: t('profile_availabilityAdded'), done: !!currentStudent.availability },
  ];
  const doneCount = completeness.filter((c) => c.done).length;
  const pct = Math.round((doneCount / completeness.length) * 100);

  const handleSave = async () => {
    setSaving(true);
    const next: Student = {
      ...draft,
      skills: skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      interests: interestsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      projects,
    };
    await updateStudentProfile(next);
    setEditing(false);
    setSaving(false);
  };

  const projectSkillsLabel = (skills?: string[]) => (skills?.length ? skills.join(", ") : "");

  const updateProject = (id: string, field: keyof StudentProject, value: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? {
              ...project,
              [field]:
                field === "skills"
                  ? value.split(",").map((s) => s.trim()).filter(Boolean)
                  : value,
            }
          : project
      )
    );
  };

  const addProject = () => {
    if (!newProject.name.trim()) return;
    const project: StudentProject = {
      id: `p-${Date.now()}`,
      name: newProject.name.trim(),
      description: newProject.description.trim(),
      link: newProject.link.trim() || undefined,
      skills: newProject.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    setProjects((prev) => [project, ...prev]);
    setNewProject({ name: "", description: "", link: "", skills: "" });
  };

  const removeProject = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('page_myProfile')}</h1>
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                {t('btn_cancel')}
              </Button>
              <Button
                size="sm"
                className="bg-[#FF0078] hover:bg-[#d60065] gap-1.5"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? t('limit_loading') : t('btn_save')}
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" className="gap-1.5 font-medium" onClick={() => setEditing(true)}>
              <Edit3 className="w-3.5 h-3.5" />
              {t('btn_edit')}
            </Button>
          )}
        </div>
      </div>

      {profileStatus === "missing" && (
        <div className="bg-amber-50 border border-amber-100 text-amber-700 text-sm rounded-lg px-4 py-3">
          {t('profile_missing')}
        </div>
      )}
      {profileStatus === "error" && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-3">
          {t('profile_error')}
        </div>
      )}

      {/* Profile hero card */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {/* Top colour band */}
        <div className="h-16 bg-gradient-to-r from-violet-500 to-violet-600" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-8 mb-4">
            <img
              src={currentStudent.avatar}
              alt={currentStudent.name}
              className="w-16 h-16 rounded-full border-4 border-white shadow-sm"
            />
            <div className="pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-gray-900">{currentStudent.name}</h2>
                {currentStudent.iknow_verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full">
                    <GraduationCap className="w-3 h-3" />
                    Verified via iKnow
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400">{currentStudent.email}</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-5">{currentStudent.bio}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-0.5">{t('label_university')}</p>
              <p className="text-xs font-semibold text-gray-800 leading-tight">
                {currentStudent.university}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-0.5">{t('label_major')}</p>
              <p className="text-xs font-semibold text-gray-800">{currentStudent.major}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-0.5">{t('label_yearGpa')}</p>
              <p className="text-xs font-semibold text-gray-800 flex items-center gap-1">
                {currentStudent.year}
                {currentStudent.gpa && (
                  <span className="flex items-center gap-0.5 text-yellow-500">
                    · <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {currentStudent.gpa}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{t('section_skills')}</h3>
          <span className="text-xs text-gray-400">{currentStudent.skills.length} {t('label_skillsAdded')}</span>
        </div>
        {editing ? (
          <div>
            <label className="text-xs text-gray-400 block mb-2">{t('label_skills')}</label>
            <textarea
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              rows={3}
              placeholder="React, TypeScript, SQL"
              className="w-full text-sm border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF0078] focus:border-transparent placeholder:text-gray-300"
            />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {currentStudent.skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="bg-[#FF0078]/10 text-[#FF0078] border border-[#FF0078]/20 px-3 py-1 text-sm font-medium"
              >
                {skill}
              </Badge>
            ))}
            {currentStudent.skills.length === 0 && (
              <span className="text-xs text-gray-400">{t('empty_skills')}</span>
            )}
          </div>
        )}
      </div>

      {/* Projects */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{t('section_projects')}</h3>
          <span className="text-xs text-gray-400">{projects.length} {t('label_projectsAdded')}</span>
        </div>
        {editing ? (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border border-gray-100 rounded-lg p-4 space-y-2">
                <input
                  value={project.name}
                  onChange={(e) => updateProject(project.id, "name", e.target.value)}
                  placeholder={t('placeholder_projectName')}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
                />
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, "description", e.target.value)}
                  placeholder={t('placeholder_projectDesc')}
                  rows={2}
                  className="w-full text-sm border border-gray-200 rounded-lg p-3 resize-none"
                />
                <input
                  value={project.link ?? ""}
                  onChange={(e) => updateProject(project.id, "link", e.target.value)}
                  placeholder={t('placeholder_projectLink')}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
                />
                <input
                  value={projectSkillsLabel(project.skills)}
                  onChange={(e) => updateProject(project.id, "skills", e.target.value)}
                  placeholder={t('placeholder_projectSkills')}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
                />
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => removeProject(project.id)}>
                    {t('btn_remove')}
                  </Button>
                </div>
              </div>
            ))}
            <div className="border border-dashed border-gray-200 rounded-lg p-4 space-y-2">
              <input
                value={newProject.name}
                onChange={(e) => setNewProject((prev) => ({ ...prev, name: e.target.value }))}
                placeholder={t('placeholder_projectName')}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
              />
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
                placeholder={t('placeholder_projectDesc')}
                rows={2}
                className="w-full text-sm border border-gray-200 rounded-lg p-3 resize-none"
              />
              <input
                value={newProject.link}
                onChange={(e) => setNewProject((prev) => ({ ...prev, link: e.target.value }))}
                placeholder={t('placeholder_projectLink')}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
              />
              <input
                value={newProject.skills}
                onChange={(e) => setNewProject((prev) => ({ ...prev, skills: e.target.value }))}
                placeholder={t('placeholder_projectSkills')}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
              />
              <div className="flex justify-end">
                <Button size="sm" onClick={addProject} className="bg-[#FF0078] hover:bg-[#d60065]">
                  {t('btn_addProject')}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.length === 0 ? (
              <p className="text-xs text-gray-400">{t('empty_projects')}</p>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">{project.name}</p>
                    {project.link && (
                      <span className="text-xs text-gray-400">{project.link}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{project.description}</p>
                  {project.skills?.length ? (
                    <p className="text-xs text-gray-400 mt-2">{project.skills.join(", ")}</p>
                  ) : null}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Interests + Availability */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900">{t('section_interests')}</h3>
          {editing ? (
            <input
              value={interestsInput}
              onChange={(e) => setInterestsInput(e.target.value)}
              placeholder={t('placeholder_interests')}
              className="mt-2 w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
            />
          ) : (
            <p className="text-xs text-gray-500 mt-2">
              {currentStudent.interests?.length
                ? currentStudent.interests.join(", ")
                : t('empty_interests')}
            </p>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{t('section_availability')}</h3>
          {editing ? (
            <input
              value={draft.availability ?? ""}
              onChange={(e) => setDraft((prev) => ({ ...prev, availability: e.target.value }))}
              placeholder={t('placeholder_availability')}
              className="mt-2 w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
            />
          ) : (
            <p className="text-xs text-gray-500 mt-2">
              {currentStudent.availability ?? t('empty_availability')}
            </p>
          )}
        </div>
      </div>

      {/* Top job matches based on skills */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FF0078]" />
            <h3 className="font-semibold text-gray-900">{t('section_topMatches')}</h3>
          </div>
          <Link href="/student/dashboard">
            <Button variant="ghost" size="sm" className="text-[#FF0078] text-xs font-medium gap-1">
              {t('btn_seeAll')} <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {topMatches.map(({ job, score }) => (
            <Link key={job.id} href="/student/dashboard">
              <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                  {job.orgLogo ? (
                    <img src={job.orgLogo} alt={job.orgName} className="w-6 h-6" />
                  ) : (
                    <span className="text-xs font-bold text-gray-400">{job.orgName[0]}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate group-hover:text-[#FF0078] transition-colors">
                    {job.title}
                  </p>
                  <p className="text-xs text-gray-400">{job.orgName} · {job.salary}</p>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                    score >= 80
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-[#FF0078]/10 text-[#FF0078]"
                  }`}
                >
                  <Zap className="w-3 h-3" />{score}%
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">{t('section_links')}</h3>
        <div className="space-y-2.5">
          {currentStudent.linkedin && (
            <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-blue-50">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                <Link2 className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span className="text-sm text-blue-700 font-medium">{currentStudent.linkedin}</span>
              <CheckCircle2 className="w-4 h-4 text-blue-400 ml-auto" />
            </div>
          )}
          {currentStudent.github && (
            <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-gray-50">
              <div className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center">
                <GitBranch className="w-3.5 h-3.5 text-gray-700" />
              </div>
              <span className="text-sm text-gray-700 font-medium">{currentStudent.github}</span>
              <CheckCircle2 className="w-4 h-4 text-gray-400 ml-auto" />
            </div>
          )}
          <p className="text-xs text-gray-400">{t('linker_no_cv')}</p>
        </div>
      </div>

      {/* Profile completeness */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{t('section_profileStrength')}</h3>
          <span
            className={`text-sm font-bold ${
              pct >= 80 ? "text-emerald-600" : pct >= 60 ? "text-[#FF0078]" : "text-amber-500"
            }`}
          >
            {pct}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
          <div
            className={`h-2 rounded-full transition-all ${
              pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-[#FF0078]/100" : "bg-amber-400"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="space-y-2">
          {completeness.map(({ label, done }) => (
            <div key={label} className="flex items-center gap-2.5 text-sm">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                  done ? "bg-emerald-100" : "bg-gray-100"
                }`}
              >
                {done ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                )}
              </div>
              <span className={done ? "text-gray-600" : "text-gray-400"}>{label}</span>
            </div>
          ))}
        </div>
        {completeness.some((c) => !c.done) && (
          <p className="text-xs text-[#FF0078] font-medium mt-4 bg-[#FF0078]/10 rounded-lg px-3 py-2">
            {t('profile_structuredTip')}
          </p>
        )}
      </div>
    </div>
  );
}
