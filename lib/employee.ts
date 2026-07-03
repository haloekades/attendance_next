import { getApiUrl } from "./api";
import type { Employee } from "./types";

export async function getEmployees(token: string): Promise<Employee[]> {
  const response = await fetch(`${getApiUrl()}/employees`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to load employees (${response.status})`);
  }

  return response.json();
}
