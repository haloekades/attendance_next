import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { DashboardHeader } from "@/components/DashboardHeader";
import { EmployeeNav } from "@/components/EmployeeNav";

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <DashboardHeader employee={session.employee} eyebrow="Employee dashboard" />
      <EmployeeNav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
