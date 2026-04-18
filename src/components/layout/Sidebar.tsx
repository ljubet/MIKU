"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { useLang } from "@/lib/language-context";
import { LANGUAGES } from "@/lib/translations";
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
} from "lucide-react";

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setRole, currentStudent, currentOrg } = useApp();
  const { lang, setLang, t } = useLang();

  const studentNav = [
    { href: "/student/dashboard", label: t('nav_dashboard'), icon: LayoutDashboard },
    { href: "/student/saved", label: t('nav_savedJobs'), icon: Bookmark },
    { href: "/student/applications", label: t('nav_applications'), icon: FileText },
    { href: "/student/profile", label: t('nav_myProfile'), icon: User },
  ];

  const orgNav = [
    { href: "/org/dashboard", label: t('nav_dashboard'), icon: LayoutDashboard },
    { href: "/org/post", label: t('nav_postJob'), icon: PlusCircle },
    { href: "/org/listings", label: t('nav_listings'), icon: List },
    { href: "/org/applicants", label: t('nav_applicants'), icon: Users },
    { href: "/org/profile", label: t('nav_companyProfile'), icon: Building2 },
  ];

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
        <Link href="/">
          <img src="/Logo LINKER FINAL 3.png" alt="Linker" className="h-8 w-auto" />
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
                ? "bg-white text-[#FF0078] shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            {t('role_student')}
          </button>
          <button
            onClick={() => switchRole("org")}
            className={cn(
              "flex-1 text-xs font-medium py-1.5 rounded-md transition-all",
              role === "org"
                ? "bg-white text-[#FF0078] shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            {t('role_org')}
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
                  ? "bg-[#FF0078]/10 text-[#FF0078]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  active ? "text-[#FF0078]" : "text-gray-400 group-hover:text-gray-600"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Language selector */}
      <div className="px-4 py-3 border-t border-gray-50">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as typeof lang)}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#FF0078]/30 focus:border-[#FF0078]/50 cursor-pointer transition-colors hover:border-gray-300"
        >
          {LANGUAGES.map(({ code, label, flag }) => (
            <option key={code} value={code}>
              {flag} {label}
            </option>
          ))}
        </select>
      </div>

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
