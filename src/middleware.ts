import { NextRequest, NextResponse } from "next/server";
import type { Destination } from "./lib/destination";
import specsToDiff from "./lib/utils/specsToDiff";
import splitParts from "./lib/utils/splitParts";

enum STATUS_CODES {
    TEMPORARY_REDIRECT = 307,
    PERMANENT_REDIRECT = 308,
}

export const config = {
    matcher: "/((?!(?:about|api|_next|diff)(?:/.*)?|favicon.ico|icon.png).+)",
};

export async function middleware(request: NextRequest) {
    console.log("[middleware]", request.nextUrl.pathname);

    const parts = request.nextUrl.pathname.split("/")[1];

    const specsOrVersions = splitParts(parts);

    const url = new URL(`/api/-/destination`, request.url);
    specsOrVersions.forEach((spec) => url.searchParams.append("specs", spec));

    console.log("[middleware] fetching", url.toString());

    const { redirect: red, canonicalSpecs }: Destination = await fetch(
        url.toString(),
    ).then((res) => res.json());

    if (red) {
        console.log("[middleware] redirecting to", red);
        return NextResponse.redirect(
            new URL(`/${specsToDiff(canonicalSpecs)}`, request.nextUrl),
            red === "permanent"
                ? STATUS_CODES.PERMANENT_REDIRECT
                : STATUS_CODES.TEMPORARY_REDIRECT,
        );
    } else {
        const url = new URL(
            `/diff/${encodeURIComponent(
                canonicalSpecs[0],
            )}/${encodeURIComponent(canonicalSpecs[1])}`,
            request.url,
        );
        console.log("[middleware] rewriting", url.toString());
        return NextResponse.rewrite(url.toString());
    }

    return NextResponse.next();
}
