import { LogoutButton } from "./LogoutButton";
import type { Employee } from "@/lib/types";

export function DashboardHeader({
  employee,
  eyebrow,
  actions,
}: {
  employee: Employee;
  eyebrow: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {eyebrow}
          </p>
          <h1 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            Welcome, {employee.name}
          </h1>
          {(employee.job || employee.department) && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {[employee.job, employee.department].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {actions}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
