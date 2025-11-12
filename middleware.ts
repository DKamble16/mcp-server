import { NextRequest, NextResponse } from "next/server";

const buildCorsHeaders = (request: NextRequest) => {
  const origin = request.headers.get("origin");
  const allowOrigin = origin ?? "*";
  const headers: Record<string, string> = {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers":
      request.headers.get("access-control-request-headers") ?? "Content-Type",
  };

  if (origin) {
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  return headers;
};

export function middleware(request: NextRequest) {
  const corsHeaders = buildCorsHeaders(request);

  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  const response = NextResponse.next();
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
