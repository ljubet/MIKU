"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";

const JOB_TYPES = ["internship", "full-time", "part-time"];

export default function PostJobPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "internship",
    location: "",
    remote: false,
    salary: "",
    description: "",
    requirements: "",
    tags: "",
    deadline: "",
  });

  const set = (k: string, v: string | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Job posted!</h2>
        <p className="text-gray-500 text-sm mb-6">
          <span className="font-medium text-gray-700">{form.title}</span> is now live and visible
          to students.
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setSubmitted(false);
              setForm({
                title: "",
                type: "internship",
                location: "",
                remote: false,
                salary: "",
                description: "",
                requirements: "",
                tags: "",
                deadline: "",
              });
            }}
          >
            Post another
          </Button>
          <Button
            className="bg-violet-600 hover:bg-violet-700"
            onClick={() => router.push("/org/listings")}
          >
            View listings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Post a Job</h1>
        <p className="text-gray-400 text-sm mt-1">
          Fill in the details below to publish a new opportunity.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-sm">Basic info</h2>

          <div>
            <Label className="text-xs text-gray-500 mb-1.5 block">Job title *</Label>
            <Input
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Frontend Engineering Intern"
              className="border-gray-200 focus-visible:ring-violet-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-gray-500 mb-1.5 block">Job type *</Label>
              <div className="flex gap-2 flex-wrap">
                {JOB_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("type", t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                      form.type === t
                        ? "bg-violet-600 text-white border-violet-600"
                        : "bg-white text-gray-500 border-gray-200 hover:border-violet-200"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs text-gray-500 mb-1.5 block">Location *</Label>
              <Input
                required
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="e.g. Skopje, MK"
                className="border-gray-200 focus-visible:ring-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-gray-500 mb-1.5 block">
                Salary / Compensation
              </Label>
              <Input
                value={form.salary}
                onChange={(e) => set("salary", e.target.value)}
                placeholder="e.g. €400–600/mo"
                className="border-gray-200 focus-visible:ring-violet-500"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1.5 block">Application deadline</Label>
              <Input
                type="date"
                value={form.deadline}
                onChange={(e) => set("deadline", e.target.value)}
                className="border-gray-200 focus-visible:ring-violet-500"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.remote}
              onChange={(e) => set("remote", e.target.checked)}
              className="w-4 h-4 rounded accent-violet-600"
            />
            <span className="text-sm text-gray-600">Remote / hybrid OK</span>
          </label>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-sm">Details</h2>

          <div>
            <Label className="text-xs text-gray-500 mb-1.5 block">Description *</Label>
            <textarea
              required
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the role, what students will learn, and the team culture."
              rows={4}
              className="w-full text-sm border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder:text-gray-300"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-500 mb-1.5 block">
              Requirements
              <span className="text-gray-300 font-normal ml-1">(one per line)</span>
            </Label>
            <textarea
              value={form.requirements}
              onChange={(e) => set("requirements", e.target.value)}
              placeholder="React experience&#10;TypeScript basics&#10;Good communication"
              rows={3}
              className="w-full text-sm border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder:text-gray-300"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-500 mb-1.5 block">
              Skills / Tags
              <span className="text-gray-300 font-normal ml-1">(comma separated)</span>
            </Label>
            <Input
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="React, TypeScript, Tailwind, Frontend"
              className="border-gray-200 focus-visible:ring-violet-500"
            />
          </div>
        </div>

        <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 py-5">
          Publish Job
        </Button>
      </form>
    </div>
  );
}
