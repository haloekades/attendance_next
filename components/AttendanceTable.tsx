"use client";

import { useMemo, useState } from "react";
import type { Attendance } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/format";

export function AttendanceTable({
  attendances,
}: {
  attendances: Attendance[];
}) {
  const [search, setSearch] = useState("");

  const records = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? attendances.filter((record) =>
          record.employee.name.toLowerCase().includes(query)
        )
      : attendances;

    return filtered
      .slice()
      .sort((a, b) => new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime());
  }, [attendances, search]);

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by employee name…"
        className="w-full max-w-xs rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-300 dark:focus:ring-zinc-300"
      />

      {records.length === 0 && (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          No attendance records found.
        </div>
      )}

      {records.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <tr>
                <th className="px-6 py-3 font-medium">Employee</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Clock In</th>
                <th className="px-6 py-3 font-medium">Clock Out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {records.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-3 font-medium text-zinc-950 dark:text-zinc-50">
                    {record.employee.name}
                  </td>
                  <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300">
                    {formatDate(record.clockIn)}
                  </td>
                  <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300">
                    {formatTime(record.clockIn)}
                  </td>
                  <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300">
                    {formatTime(record.clockOut)}
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
