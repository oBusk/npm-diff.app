import { type NextRequest, NextResponse } from "next/server";
import destination from "^/lib/destination";

function assureArrayLength(specs: string[]) {
    if (specs.length < 3) {
        return specs as [string] | [string, string];
    }
    throw new Error("Too many specs");
}

export async function GET(req: NextRequest, { params }: { params: {} }) {
    const { searchParams } = new URL(req.url);

    const specsOrVersions = assureArrayLength(
        searchParams.getAll("specs") ?? "",
    );

    console.log("[api/-/destination] running", specsOrVersions);

    const result = await destination(specsOrVersions);

    return NextResponse.json(result);
}
