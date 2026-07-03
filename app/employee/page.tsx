import Link from "next/link";

const menuItems = [
  {
    href: "/employee/detail",
    title: "Employee Detail",
    description: "View your personal and employment information.",
  },
  {
    href: "/employee/attendance-today",
    title: "Attendance Today",
    description: "Check in, check out, and see today's status.",
  },
  {
    href: "/employee/summary",
    title: "Summary Attendance",
    description: "Review your attendance history and totals.",
  },
];

export default function EmployeeHomePage() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-colors hover:border-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-300"
        >
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
            {item.title}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {item.description}
          </p>
          <span className="mt-2 text-sm font-medium text-zinc-950 group-hover:underline dark:text-zinc-50">
            Open &rarr;
          </span>
        </Link>
      ))}
    </div>
  );
}
