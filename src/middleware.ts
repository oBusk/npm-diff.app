import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Temporary workaround to make navigation between app/pages work
    // https://github.com/vercel/next.js/issues/42364#issuecomment-1300836034
    return NextResponse.rewrite(new URL(request.nextUrl.pathname, request.url));
}
