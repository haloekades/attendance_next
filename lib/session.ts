import { cookies } from "next/headers";
import type { Employee } from "./types";

const SESSION_COOKIE = "session";
const EMPLOYEE_COOKIE = "employee";
const DEFAULT_MAX_AGE = 60 * 60 * 24; // 1 day, used if the token has no readable expiry

function decodeJwtExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      Buffer.from(payload, "base64").toString("utf-8")
    );
    return typeof decoded.exp === "number" ? decoded.exp : null;
  } catch {
    return null;
  }
}

export async function setSessionCookies(token: string, employee: Employee) {
  const cookieStore = await cookies();
  const exp = decodeJwtExpiry(token);
  const maxAge = exp
    ? Math.max(exp - Math.floor(Date.now() / 1000), 0)
    : DEFAULT_MAX_AGE;

  const baseOptions = {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };

  // The token stays httpOnly so client-side JS can never read it.
  cookieStore.set(SESSION_COOKIE, token, { ...baseOptions, httpOnly: true });
  // Employee data is not sensitive and is readable by the proxy and client UI.
  cookieStore.set(EMPLOYEE_COOKIE, JSON.stringify(employee), {
    ...baseOptions,
    httpOnly: false,
  });
}

export async function clearSessionCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(EMPLOYEE_COOKIE);
}

export async function getSession(): Promise<{
  token: string;
  employee: Employee;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const employeeRaw = cookieStore.get(EMPLOYEE_COOKIE)?.value;

  if (!token || !employeeRaw) {
    return null;
  }

  try {
    const employee = JSON.parse(employeeRaw) as Employee;
    return { token, employee };
  } catch {
    return null;
  }
}
