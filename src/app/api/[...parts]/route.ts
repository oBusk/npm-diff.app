import { type NextRequest, NextResponse } from "next/server";
import destination, {
    type Destination,
    SpecNotFoundError,
} from "^/lib/destination";
import npmDiff from "^/lib/npmDiff";
import { fromSearchParams, parseDiffOptions } from "^/lib/query";
import { defaultPageCachingHeaders } from "^/lib/utils/headers";
import parseParts from "^/lib/utils/parseParts";
import specsToDiff from "^/lib/utils/specsToDiff";

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

    const specsOrVersions = parseParts(parts);

    if (specsOrVersions == null) {
        return NextResponse.json("Invalid package spec", { status: 400 });
    }

    const parsedOptions = parseDiffOptions(fromSearchParams(searchParams));

    if (!parsedOptions.ok) {
        return NextResponse.json(parsedOptions.message, { status: 400 });
    }

    let target: Destination;
    try {
        target = await destination(specsOrVersions);
    } catch (e) {
        if (e instanceof SpecNotFoundError) {
            return NextResponse.json(e.message, { status: 404 });
        }
        throw e;
    }

    const { redirect: red, canonicalSpecs } = target;

    if (red === false) {
        const result = await npmDiff(canonicalSpecs, parsedOptions.options);

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

        searchParams.forEach((value, key) => {
            newUrl.searchParams.append(key, value);
        });

        return NextResponse.redirect(
            newUrl,
            red === "permanent"
                ? STATUS_CODES.PERMANENT_REDIRECT
                : STATUS_CODES.TEMPORARY_REDIRECT,
        );
    }
}
