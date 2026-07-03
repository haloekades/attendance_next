"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Attendance } from "@/lib/types";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AttendanceTodayCard({
  record,
}: {
  record: Attendance | null;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClockIn() {
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/attendances/clock-in", {
        method: "POST",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.message ?? "Unable to clock in. Please try again.");
        return;
      }
      router.refresh();
    } catch {
      setError("Unable to clock in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleClockOut() {
    if (!record) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/attendances/${record.id}`, {
        method: "PATCH",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.message ?? "Unable to clock out. Please try again.");
        return;
      }
      router.refresh();
    } catch {
      setError("Unable to clock out. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {!record && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            You haven&apos;t clocked in today.
          </p>
          <button
            type="button"
            onClick={handleClockIn}
            disabled={isSubmitting}
            className="rounded-full bg-zinc-950 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {isSubmitting ? "Clocking in…" : "Clock In"}
          </button>
        </div>
      )}

      {record && !record.clockOut && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Clocked in at{" "}
            <span className="font-medium text-zinc-950 dark:text-zinc-50">
              {formatTime(record.clockIn)}
            </span>
          </p>
          <button
            type="button"
            onClick={handleClockOut}
            disabled={isSubmitting}
            className="rounded-full bg-zinc-950 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {isSubmitting ? "Clocking out…" : "Clock Out"}
          </button>
        </div>
      )}

      {record && record.clockOut && (
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            You&apos;re done for today.
          </p>
          <p className="text-sm text-zinc-950 dark:text-zinc-50">
            <span className="font-medium">{formatTime(record.clockIn)}</span>
            {" – "}
            <span className="font-medium">
              {formatTime(record.clockOut)}
            </span>
          </p>
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}
