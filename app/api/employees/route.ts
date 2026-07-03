import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getApiUrl } from "@/lib/api";

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { message: "Not authenticated." },
      { status: 401 }
    );
  }

  if (session.employee.role !== "admin") {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const role = body?.role === "admin" ? "admin" : "employee";
  const job = typeof body?.job === "string" ? body.job.trim() : "";
  const department =
    typeof body?.department === "string" ? body.department.trim() : "";
  const age = Number(body?.age);
  const gender = typeof body?.gender === "string" ? body.gender : "";

  if (
    !name ||
    !email ||
    !password ||
    !job ||
    !department ||
    !gender ||
    !Number.isFinite(age)
  ) {
    return NextResponse.json(
      { message: "All fields are required." },
      { status: 400 }
    );
  }

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(`${getApiUrl()}/employees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        job,
        department,
        age,
        gender,
      }),
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach the employee server." },
      { status: 502 }
    );
  }

  const data = await upstreamResponse.json().catch(() => null);

  if (!upstreamResponse.ok) {
    return NextResponse.json(
      { message: data?.message ?? "Unable to create employee." },
      { status: upstreamResponse.status }
    );
  }

  return NextResponse.json(data, { status: 201 });
}
