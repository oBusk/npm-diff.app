import { type NextRequest, NextResponse } from "next/server";
import destination from "^/lib/destination";
import npmDiff from "^/lib/npmDiff";
import { parseQuery } from "^/lib/query";
import { defaultPageCachingHeaders } from "^/lib/utils/headers";
import specsToDiff from "^/lib/utils/specsToDiff";
import splitParts from "^/lib/utils/splitParts";

export const maxDuration = 60;

enum STATUS_CODES {
    TEMPORARY_REDIRECT = 307,
    PERMANENT_REDIRECT = 308,
}

export interface DiffApiContext {
    params: Promise<{ parts: string | string[] }>;
}

export async function GET(req: NextRequest, { params }: DiffApiContext) {
    const { parts } = await params;
    const { searchParams } = new URL(req.url);
    const options = Object.fromEntries(searchParams);

    const specsOrVersions = splitParts(parts);

    const { redirect: red, canonicalSpecs } =
        await destination(specsOrVersions);

    if (red === false) {
        const result = await npmDiff(canonicalSpecs, parseQuery(options));

        if (result.ok) {
            return new NextResponse(result.diff, {
                status: 200,
                headers: defaultPageCachingHeaders,
            });
        } else {
            const status = result.kind === "not-found" ? 404 : 500;
            return NextResponse.json(result.message, { status });
        }
    } else {
        const newUrl = new URL(`/api/${specsToDiff(canonicalSpecs)}`, req.url);

        Array.from(searchParams).forEach(([key, value]) => {
            newUrl.searchParams.set(key, value);
        });

        return NextResponse.redirect(
            newUrl,
            red === "permanent"
                ? STATUS_CODES.PERMANENT_REDIRECT
                : STATUS_CODES.TEMPORARY_REDIRECT,
        );
    }
}
