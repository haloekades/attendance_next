import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getTodayAttendance } from "@/lib/attendance";
import { AttendanceTodayCard } from "@/components/AttendanceTodayCard";

export default async function AttendanceTodayPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  let error: string | null = null;
  let records: Awaited<ReturnType<typeof getTodayAttendance>> = [];

  try {
    records = await getTodayAttendance(session.employee.id, session.token);
  } catch {
    error = "Unable to load today's attendance. Please try again.";
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

  return <AttendanceTodayCard record={records[0] ?? null} />;
}
