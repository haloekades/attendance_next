"use client";

import { useState, type SubmitEvent } from "react";
import type { Employee } from "@/lib/types";

const fieldClassName =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-300 dark:focus:ring-zinc-300";

export function EmployeeForm({
  employee,
  onCancel,
  onSuccess,
}: {
  employee?: Employee;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const isEdit = Boolean(employee);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");

    const payload: Record<string, unknown> = {
      name: String(formData.get("name") ?? ""),
      job: String(formData.get("job") ?? ""),
      department: String(formData.get("department") ?? ""),
      age: Number(formData.get("age")),
      gender: String(formData.get("gender") ?? ""),
    };

    if (isEdit) {
      if (password) payload.password = password;
    } else {
      payload.email = String(formData.get("email") ?? "");
      payload.password = password;
      payload.role = String(formData.get("role") ?? "employee");
    }

    try {
      const response = await fetch(
        isEdit ? `/api/employees/${employee?.id}` : "/api/employees",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.message ?? "Unable to save employee.");
        return;
      }

      onSuccess();
    } catch {
      setError("Unable to save employee. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
        {isEdit ? `Edit ${employee?.name}` : "Add Employee"}
      </h3>

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
            defaultValue={employee?.name}
            className={fieldClassName}
          />
        </div>

        {!isEdit && (
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={fieldClassName}
            />
          </div>
        )}

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
            defaultValue={employee?.job ?? ""}
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
            defaultValue={employee?.department ?? ""}
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
            defaultValue={employee?.age ?? ""}
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
            defaultValue={employee?.gender ?? ""}
            className={fieldClassName}
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {!isEdit && (
          <div className="flex flex-col gap-1">
            <label
              htmlFor="role"
              className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              required
              defaultValue="employee"
              className={fieldClassName}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}

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
            required={!isEdit}
            placeholder={isEdit ? "Leave blank to keep current password" : undefined}
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
          {isSubmitting ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
