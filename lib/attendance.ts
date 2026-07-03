import { getApiUrl } from "./api";
import type { Attendance } from "./types";

export interface AttendanceFilters {
  month?: string;
  startDate?: string;
  endDate?: string;
}

export async function getAttendances(
  employeeId: number,
  token: string,
  filters: AttendanceFilters
): Promise<Attendance[]> {
  const params = new URLSearchParams();

  if (filters.month) params.set("month", filters.month);
  if (filters.startDate) params.set("startDate", filters.startDate);
  if (filters.endDate) params.set("endDate", filters.endDate);

  const response = await fetch(
    `${getApiUrl()}/attendances/employee/${employeeId}?${params.toString()}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to load attendance records (${response.status})`);
  }

  return response.json();
}

export async function getTodayAttendance(
  employeeId: number,
  token: string
): Promise<Attendance[]> {
  const response = await fetch(
    `${getApiUrl()}/attendances/employee/${employeeId}/today`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load today's attendance (${response.status})`
    );
  }

  return response.json();
}

export async function getAllAttendances(token: string): Promise<Attendance[]> {
  const response = await fetch(`${getApiUrl()}/attendances`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to load attendance records (${response.status})`);
  }

  return response.json();
}

export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}
