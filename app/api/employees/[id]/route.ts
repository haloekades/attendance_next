import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getApiUrl } from "@/lib/api";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;
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
    upstreamResponse = await fetch(`${getApiUrl()}/employees/${id}`, {
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
      { message: data?.message ?? "Unable to update employee." },
      { status: upstreamResponse.status }
    );
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(`${getApiUrl()}/employees/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach the employee server." },
      { status: 502 }
    );
  }

  if (!upstreamResponse.ok) {
    const data = await upstreamResponse.json().catch(() => null);
    return NextResponse.json(
      { message: data?.message ?? "Unable to delete employee." },
      { status: upstreamResponse.status }
    );
  }

  return new NextResponse(null, { status: 204 });
}
