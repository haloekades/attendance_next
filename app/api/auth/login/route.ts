import { NextResponse } from "next/server";
import { setSessionCookies } from "@/lib/session";
import { getApiUrl } from "@/lib/api";
import type { LoginResponse } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 }
    );
  }

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(`${getApiUrl()}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach the authentication server." },
      { status: 502 }
    );
  }

  if (!upstreamResponse.ok) {
    const errorBody = await upstreamResponse.json().catch(() => null);
    return NextResponse.json(
      { message: errorBody?.message ?? "Invalid email or password." },
      { status: upstreamResponse.status }
    );
  }

  const data: LoginResponse = await upstreamResponse.json();
  await setSessionCookies(data.access_token, data.employee);

  return NextResponse.json({ employee: data.employee });
}
