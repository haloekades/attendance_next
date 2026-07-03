import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getEmployees } from "@/lib/employee";
import { EmployeeListPanel } from "@/components/EmployeeListPanel";

export default async function AdminEmployeesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  let employees: Awaited<ReturnType<typeof getEmployees>> = [];
  let error: string | null = null;

  try {
    employees = await getEmployees(session.token);
  } catch {
    error = "Unable to load employees. Please try again.";
  }

  if (error) {
    return (
      <p
        role="alert"
        className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400"
      >
        {error}
      </p>
    );
  }

  return <EmployeeListPanel employees={employees} />;
}
