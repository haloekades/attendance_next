"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Employee } from "@/lib/types";
import { EmployeeForm } from "./EmployeeForm";

type FormState = { mode: "add" } | { mode: "edit"; employee: Employee } | null;

export function EmployeeListPanel({ employees }: { employees: Employee[] }) {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>(null);
  const [pendingDelete, setPendingDelete] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function handleSuccess() {
    setFormState(null);
    router.refresh();
  }

  async function handleDeleteConfirm() {
    if (!pendingDelete) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/employees/${pendingDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setDeleteError(data?.message ?? "Unable to delete employee.");
        return;
      }

      setPendingDelete(null);
      router.refresh();
    } catch {
      setDeleteError("Unable to delete employee. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
          Employees
        </h2>
        <button
          type="button"
          onClick={() =>
            setFormState((current) =>
              current?.mode === "add" ? null : { mode: "add" }
            )
          }
          className="rounded-full bg-zinc-950 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          {formState?.mode === "add" ? "Close" : "Add Employee"}
        </button>
      </div>

      {formState && (
        <EmployeeForm
          employee={formState.mode === "edit" ? formState.employee : undefined}
          onCancel={() => setFormState(null)}
          onSuccess={handleSuccess}
        />
      )}

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Job</th>
              <th className="px-6 py-3 font-medium">Department</th>
              <th className="px-6 py-3 font-medium">Age</th>
              <th className="px-6 py-3 font-medium">Gender</th>
              <th className="px-6 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {employees.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-3 font-medium text-zinc-950 dark:text-zinc-50">
                  {item.name}
                </td>
                <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300">
                  {item.email}
                </td>
                <td className="px-6 py-3 capitalize text-zinc-700 dark:text-zinc-300">
                  {item.role}
                </td>
                <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300">
                  {item.job ?? "—"}
                </td>
                <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300">
                  {item.department ?? "—"}
                </td>
                <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300">
                  {item.age ?? "—"}
                </td>
                <td className="px-6 py-3 capitalize text-zinc-700 dark:text-zinc-300">
                  {item.gender ?? "—"}
                </td>
                <td className="px-6 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormState({ mode: "edit", employee: item })
                      }
                      className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${item.name}`}
                      onClick={() => {
                        setDeleteError(null);
                        setPendingDelete(item);
                      }}
                      className="rounded-full border border-zinc-300 p-1.5 text-zinc-500 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-red-900 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.75 1a.75.75 0 0 0-.75.75V3H4.5a.75.75 0 0 0 0 1.5h.324l.667 10.005A2.25 2.25 0 0 0 7.735 16.5h4.53a2.25 2.25 0 0 0 2.244-1.995L15.176 4.5h.324a.75.75 0 0 0 0-1.5H12v-.25a.75.75 0 0 0-.75-.75h-2.5ZM8.5 7.25a.75.75 0 0 1 1.5 0v6a.75.75 0 0 1-1.5 0v-6Zm3.5 0a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0v-6Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pendingDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div className="w-full max-w-sm space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Delete employee
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Are you sure you want to delete{" "}
              <span className="font-medium text-zinc-950 dark:text-zinc-50">
                {pendingDelete.name}
              </span>
              ? This action cannot be undone.
            </p>

            {deleteError && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400"
              >
                {deleteError}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                disabled={isDeleting}
                className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
