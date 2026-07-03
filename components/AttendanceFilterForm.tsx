"use client";

import { useState } from "react";

const inputClassName =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-300 dark:focus:ring-zinc-300";

export function AttendanceFilterForm({
  month,
  startDate,
  endDate,
  hasCustomRange,
}: {
  month: string;
  startDate?: string;
  endDate?: string;
  hasCustomRange: boolean;
}) {
  const [mode, setMode] = useState<"month" | "custom">(
    hasCustomRange ? "custom" : "month"
  );

  return (
    <form
      method="get"
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <fieldset className="flex gap-4">
        <legend className="sr-only">Filter type</legend>
        <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="radio"
            name="range"
            value="month"
            checked={mode === "month"}
            onChange={() => setMode("month")}
            className="h-4 w-4 accent-zinc-950 dark:accent-zinc-50"
          />
          This month
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="radio"
            name="range"
            value="custom"
            checked={mode === "custom"}
            onChange={() => setMode("custom")}
            className="h-4 w-4 accent-zinc-950 dark:accent-zinc-50"
          />
          Custom date
        </label>
      </fieldset>

      <div className="flex flex-wrap items-end gap-4">
        {mode === "month" ? (
          <div className="flex flex-col gap-1">
            <label
              htmlFor="month"
              className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
            >
              Month
            </label>
            <input
              id="month"
              name="month"
              type="month"
              defaultValue={month}
              className={inputClassName}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="startDate"
                className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                Start date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                required
                defaultValue={startDate}
                className={inputClassName}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="endDate"
                className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                End date
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                required
                defaultValue={endDate}
                className={inputClassName}
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="rounded-full bg-zinc-950 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Apply filter
        </button>
      </div>
    </form>
  );
}
