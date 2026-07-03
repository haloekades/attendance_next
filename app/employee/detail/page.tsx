import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { EmployeeDetailPanel } from "@/components/EmployeeDetailPanel";

export default async function EmployeeDetailPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return <EmployeeDetailPanel employee={session.employee} />;
}
