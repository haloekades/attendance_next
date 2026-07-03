import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAttendances, getCurrentMonth } from "@/lib/attendance";
import { formatDate, formatTime } from "@/lib/format";
import { AttendanceFilterForm } from "@/components/AttendanceFilterForm";

export default async function AttendanceSummaryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const params = await searchParams;
  const rawMonth =
    typeof params.month === "string" && params.month
      ? params.month
      : undefined;
  const startDate =
    typeof params.startDate === "string" && params.startDate
      ? params.startDate
      : undefined;
  const endDate =
    typeof params.endDate === "string" && params.endDate
      ? params.endDate
      : undefined;

  // "This month" and "Custom date" are mutually exclusive filter modes.
  const hasCustomRange = Boolean(startDate || endDate);
  const month = hasCustomRange ? undefined : (rawMonth ?? getCurrentMonth());

  let attendances: Awaited<ReturnType<typeof getAttendances>> = [];
  let error: string | null = null;

  try {
    attendances = await getAttendances(session.employee.id, session.token, {
      month,
      startDate,
      endDate,
    });
  } catch {
    error = "Unable to load attendance records. Please try again.";
  }

  return (
    <div className="space-y-6">
      <AttendanceFilterForm
        month={rawMonth ?? getCurrentMonth()}
        startDate={startDate}
        endDate={endDate}
        hasCustomRange={hasCustomRange}
      />

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400"
        >
          {error}
        </p>
      )}

      {!error && attendances.length === 0 && (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          No attendance records found for this period.
        </div>
      )}

      {!error && attendances.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Clock In</th>
                <th className="px-6 py-3 font-medium">Clock Out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {attendances.map((attendance) => (
                <tr key={attendance.id}>
                  <td className="px-6 py-3 font-medium text-zinc-950 dark:text-zinc-50">
                    {formatDate(attendance.clockIn)}
                  </td>
                  <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300">
                    {formatTime(attendance.clockIn)}
                  </td>
                  <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300">
                    {formatTime(attendance.clockOut)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
