"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Bookmark,
  FileText,
  User,
  Building2,
  PlusCircle,
  List,
  Users,
  Zap,
} from "lucide-react";

const studentNav = [
  { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/saved", label: "Saved Jobs", icon: Bookmark },
  { href: "/student/applications", label: "Applications", icon: FileText },
  { href: "/student/profile", label: "My Profile", icon: User },
];

const orgNav = [
  { href: "/org/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/org/post", label: "Post a Job", icon: PlusCircle },
  { href: "/org/listings", label: "Listings", icon: List },
  { href: "/org/applicants", label: "Applicants", icon: Users },
  { href: "/org/profile", label: "Company Profile", icon: Building2 },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setRole, currentStudent, currentOrg } = useApp();

  // Auto-sync role from URL so direct navigation always works
  useEffect(() => {
    if (pathname.startsWith("/org/")) setRole("org");
    else if (pathname.startsWith("/student/")) setRole("student");
  }, [pathname, setRole]);

  const switchRole = (newRole: "student" | "org") => {
    setRole(newRole);
    router.push(newRole === "student" ? "/student/dashboard" : "/org/dashboard");
    onClose?.();
  };

  const nav = role === "student" ? studentNav : orgNav;
  const name = role === "student" ? currentStudent.name : currentOrg.name;
  const sub =
    role === "student"
      ? `${currentStudent.major} · ${currentStudent.year}`
      : currentOrg.industry;
  const avatar =
    role === "student"
      ? currentStudent.avatar
      : `https://api.dicebear.com/7.x/initials/svg?seed=${currentOrg.name}`;

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">Miku</span>
        </Link>
      </div>

      {/* Role switcher */}
      <div className="px-4 py-3 border-b border-gray-50">
        <div className="bg-gray-50 rounded-lg p-1 flex gap-1">
          <button
            onClick={() => switchRole("student")}
            className={cn(
              "flex-1 text-xs font-medium py-1.5 rounded-md transition-all",
              role === "student"
                ? "bg-white text-violet-700 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            Student
          </button>
          <button
            onClick={() => switchRole("org")}
            className={cn(
              "flex-1 text-xs font-medium py-1.5 rounded-md transition-all",
              role === "org"
                ? "bg-white text-violet-700 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            Org
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                active
                  ? "bg-violet-50 text-violet-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  active ? "text-violet-600" : "text-gray-400 group-hover:text-gray-600"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User profile at bottom */}
      <div className="px-4 py-4 border-t border-gray-50">
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt={name}
            className="w-8 h-8 rounded-full border border-gray-100"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
            <p className="text-xs text-gray-400 truncate">{sub}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
