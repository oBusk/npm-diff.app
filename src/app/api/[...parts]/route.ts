import { NextRequest, NextResponse } from "next/server";
import destination from "^/lib/destination";
import npmDiff, { NpmDiffError } from "^/lib/npmDiff";
import { parseQuery } from "^/lib/query";
import { defaultPageCachingHeaders } from "^/lib/utils/headers";
import specsToDiff from "^/lib/utils/specsToDiff";
import splitParts from "^/lib/utils/splitParts";

enum STATUS_CODES {
    TEMPORARY_REDIRECT = 307,
    PERMANENT_REDIRECT = 308,
}

export async function GET(
    req: NextRequest,
    { params: { parts } }: { params: { parts: string[] } },
) {
    const { searchParams } = new URL(req.url);
    const options = Object.fromEntries(searchParams);

    const specsOrVersions = splitParts(parts);

    const { redirect: red, canonicalSpecs } =
        await destination(specsOrVersions);

    if (red === false) {
        try {
            const diff = await npmDiff(canonicalSpecs, parseQuery(options));

            return new NextResponse(diff, {
                status: 200,
                headers: defaultPageCachingHeaders,
            });
        } catch (e) {
            const { code, error } = e as NpmDiffError;

            return NextResponse.json(error, { status: code });
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
