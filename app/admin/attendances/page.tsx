import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAllAttendances } from "@/lib/attendance";
import { AttendanceTable } from "@/components/AttendanceTable";
import type { Attendance } from "@/lib/types";

export default async function AdminAttendancesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  let attendances: Attendance[] = [];
  let error: string | null = null;

  try {
    attendances = await getAllAttendances(session.token);
  } catch {
    error = "Unable to load attendance records. Please try again.";
  }

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
        Attendance
      </h2>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400"
        >
          {error}
        </p>
      )}

      {!error && <AttendanceTable attendances={attendances} />}
    </div>
  );
}
