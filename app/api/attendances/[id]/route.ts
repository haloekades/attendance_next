import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getApiUrl } from "@/lib/api";

export async function PATCH(
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

  const { id } = await params;

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(`${getApiUrl()}/attendances/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify({ clockOut: new Date().toISOString() }),
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach the attendance server." },
      { status: 502 }
    );
  }

  const data = await upstreamResponse.json().catch(() => null);

  if (!upstreamResponse.ok) {
    return NextResponse.json(
      { message: data?.message ?? "Unable to clock out." },
      { status: upstreamResponse.status }
    );
  }

  return NextResponse.json(data);
}
