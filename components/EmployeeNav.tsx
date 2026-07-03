"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/employee", label: "Home" },
  { href: "/employee/detail", label: "Employee Detail" },
  { href: "/employee/attendance-today", label: "Attendance Today" },
  { href: "/employee/summary", label: "Summary Attendance" },
];

export function EmployeeNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 sm:px-6">
        {links.map((link) => {
          const isActive =
            link.href === "/employee"
              ? pathname === "/employee"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "border-zinc-950 text-zinc-950 dark:border-zinc-50 dark:text-zinc-50"
                  : "border-transparent text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
