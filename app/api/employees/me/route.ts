import { NextResponse } from "next/server";
import { getSession, setSessionCookies } from "@/lib/session";
import { getApiUrl } from "@/lib/api";
import type { Employee } from "@/lib/types";

export async function PATCH(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { message: "Not authenticated." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const job = typeof body?.job === "string" ? body.job.trim() : "";
  const department =
    typeof body?.department === "string" ? body.department.trim() : "";
  const age = Number(body?.age);
  const gender = typeof body?.gender === "string" ? body.gender : "";
  const password =
    typeof body?.password === "string" && body.password
      ? body.password
      : undefined;

  if (!name || !job || !department || !gender || !Number.isFinite(age)) {
    return NextResponse.json(
      { message: "All fields are required." },
      { status: 400 }
    );
  }

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(
      `${getApiUrl()}/employees/${session.employee.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({
          name,
          job,
          department,
          age,
          gender,
          ...(password ? { password } : {}),
        }),
      }
    );
  } catch {
    return NextResponse.json(
      { message: "Unable to reach the employee server." },
      { status: 502 }
    );
  }

  const data = await upstreamResponse.json().catch(() => null);

  if (!upstreamResponse.ok) {
    return NextResponse.json(
      { message: data?.message ?? "Unable to update employee detail." },
      { status: upstreamResponse.status }
    );
  }

  const updatedEmployee: Employee = { ...session.employee, ...data };
  await setSessionCookies(session.token, updatedEmployee);

  return NextResponse.json({ employee: updatedEmployee });
}
