import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AdminNav } from "@/components/AdminNav";
import { NotificationBell } from "@/components/NotificationBell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  if (session.employee.role !== "admin") {
    redirect("/employee");
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <DashboardHeader
        employee={session.employee}
        eyebrow="Admin dashboard"
        actions={<NotificationBell token={session.token} />}
      />
      <AdminNav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
