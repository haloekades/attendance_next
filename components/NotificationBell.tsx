"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import { formatDate, formatTime } from "@/lib/format";

export function NotificationBell({ token }: { token: string }) {
  const router = useRouter();
  const notifications = useAdminNotifications(token);
  const [isOpen, setIsOpen] = useState(false);
  const [readCount, setReadCount] = useState(0);
  const unreadCount = notifications.length - readCount;

  function handleToggle() {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);

    if (nextOpen) {
      setReadCount(notifications.length);
      router.refresh();
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Employee update notifications"
        onClick={handleToggle}
        className="relative rounded-full border border-zinc-300 p-2 text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M10 2a6 6 0 0 0-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 0 0 .515 1.076c1.2.28 2.42.485 3.657.612a3 3 0 0 0 5.97 0c1.237-.127 2.457-.333 3.657-.612a.75.75 0 0 0 .515-1.076A11.45 11.45 0 0 1 16 8a6 6 0 0 0-6-6Zm0 15.5a1.5 1.5 0 0 1-1.483-1.276c.483.024.97.037 1.463.037h.04c.494 0 .98-.013 1.463-.037A1.5 1.5 0 0 1 10 17.5Z"
            clipRule="evenodd"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-medium text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-72 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <p className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Employee updates
          </p>
          {notifications.length === 0 ? (
            <p className="px-2 py-3 text-sm text-zinc-500 dark:text-zinc-400">
              No updates yet.
            </p>
          ) : (
            <ul className="max-h-72 space-y-1 overflow-y-auto">
              {notifications.map((event, index) => (
                <li
                  key={`${event.employeeId}-${event.updatedAt}-${index}`}
                  className="rounded-lg px-2 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <p className="font-medium text-zinc-950 dark:text-zinc-50">
                    {event.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Updated {event.changedFields.join(", ")} ·{" "}
                    {formatDate(event.updatedAt)} {formatTime(event.updatedAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
