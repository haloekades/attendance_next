"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import type { Employee } from "@/lib/types";

const fieldClassName =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-300 dark:focus:ring-zinc-300";

export function EmployeeDetailPanel({ employee }: { employee: Employee }) {
  const router = useRouter();
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fields: { label: string; value: string; capitalize?: boolean }[] = [
    { label: "Full name", value: employee.name },
    { label: "Email", value: employee.email },
    { label: "Role", value: employee.role, capitalize: true },
    { label: "Job title", value: employee.job ?? "—" },
    { label: "Department", value: employee.department ?? "—" },
    { label: "Age", value: employee.age !== null ? String(employee.age) : "—" },
    { label: "Gender", value: employee.gender ?? "—", capitalize: true },
  ];

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");

    try {
      const response = await fetch("/api/employees/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") ?? ""),
          job: String(formData.get("job") ?? ""),
          department: String(formData.get("department") ?? ""),
          age: Number(formData.get("age")),
          gender: String(formData.get("gender") ?? ""),
          ...(password ? { password } : {}),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.message ?? "Unable to save changes.");
        return;
      }

      setMode("view");
      router.refresh();
    } catch {
      setError("Unable to save changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (mode === "view") {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
            Employee Detail
          </h2>
          <button
            type="button"
            onClick={() => setMode("edit")}
            className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Edit
          </button>
        </div>
        <dl className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {fields.map((field) => (
            <div
              key={field.label}
              className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <dt className="text-sm text-zinc-500 dark:text-zinc-400">
                {field.label}
              </dt>
              <dd
                className={`text-sm font-medium text-zinc-950 dark:text-zinc-50 ${
                  field.capitalize ? "capitalize" : ""
                }`}
              >
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
        Edit Employee Detail
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="name"
            className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={employee.name}
            className={fieldClassName}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="job"
            className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            Job title
          </label>
          <input
            id="job"
            name="job"
            type="text"
            required
            defaultValue={employee.job ?? ""}
            className={fieldClassName}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="department"
            className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            Department
          </label>
          <input
            id="department"
            name="department"
            type="text"
            required
            defaultValue={employee.department ?? ""}
            className={fieldClassName}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="age"
            className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            Age
          </label>
          <input
            id="age"
            name="age"
            type="number"
            min={0}
            required
            defaultValue={employee.age ?? ""}
            className={fieldClassName}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="gender"
            className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            required
            defaultValue={employee.gender ?? ""}
            className={fieldClassName}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Leave blank to keep current password"
            className={fieldClassName}
          />
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400"
        >
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-zinc-950 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          {isSubmitting ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setMode("view");
          }}
          className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
