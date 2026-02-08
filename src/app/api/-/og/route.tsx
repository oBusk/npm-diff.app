import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getSourceInformation } from "^/lib/api/npm/sourceInformation";
import { createSimplePackageSpec } from "^/lib/createSimplePackageSpec";
import destination from "^/lib/destination";
import { gitDiffParse } from "^/lib/gitDiff";
import npmDiff from "^/lib/npmDiff";
import countChanges from "^/lib/utils/countChanges";
import decodeParts from "^/lib/utils/decodeParts";
import splitParts from "^/lib/utils/splitParts";

function formatNumber(num: number): string {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const parts = searchParams.get("parts");

    if (!parts) {
        return new Response("Missing parts parameter", { status: 400 });
    }

    const specsOrVersions = splitParts(decodeParts(parts));
    const { canonicalSpecs } = await destination(specsOrVersions);
    const [a, b] = canonicalSpecs.map((spec) => createSimplePackageSpec(spec));

    // Get diff statistics
    const diff = await npmDiff(canonicalSpecs, {});
    const files = gitDiffParse(diff);
    const changes = files.map((file) => countChanges(file.hunks));
    const additions = changes
        .map(({ additions }) => additions)
        .reduce((a, b) => a + b, 0);
    const deletions = changes
        .map(({ deletions }) => deletions)
        .reduce((a, b) => a + b, 0);

    // Get source information for badges
    const [sourceA, sourceB] = await Promise.all([
        getSourceInformation({ name: a.name, version: a.version }).catch(
            () => null,
        ),
        getSourceInformation({ name: b.name, version: b.version }).catch(
            () => null,
        ),
    ]);

    const hasProvenance = !!(sourceA || sourceB);
    const hasTrustedPublisher = !!(
        sourceA?.hasTrustedPublisher || sourceB?.hasTrustedPublisher
    );

    const logoData = await readFile(join(process.cwd(), "src/app/icon.png"));
    const logoSrc = Uint8Array.from(logoData).buffer;

    const packageName = a.name;
    const versionCompare = `${a.version} → ${b.version}`;

    return new ImageResponse(
        <div
            style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#0d1117",
                backgroundImage:
                    "radial-gradient(circle at bottom left, rgba(18, 39, 74, 1), transparent 70%), radial-gradient(circle at top right, rgba(18, 39, 74, 1), transparent 70%), linear-gradient(rgba(55, 65, 81, 0.3) 2px, transparent 2px), linear-gradient(90deg, rgba(55, 65, 81, 0.3) 2px, transparent 2px)",
                backgroundSize: "100% 100%, 100% 100%, 50px 50px, 50px 50px",
                position: "relative",
            }}
        >
            {/* Logo */}
            {/* eslint-disable-next-line @next/next/no-img-element -- OpenGraph images require standard img tag */}
            <img
                src={logoSrc as unknown as string}
                width={80}
                height={80}
                style={{
                    position: "absolute",
                    top: 40,
                    left: 40,
                }}
                alt="npm-diff.app icon"
            />

            {/* Main content */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    width: "100%",
                    padding: "0 80px",
                    gap: "24px",
                }}
            >
                {/* Package name */}
                <div
                    style={{
                        display: "flex",
                        fontSize: "48px",
                        fontWeight: 700,
                        color: "white",
                        margin: 0,
                        lineHeight: 1.2,
                        maxWidth: "800px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {packageName}
                </div>

                {/* Version comparison */}
                <div
                    style={{
                        display: "flex",
                        fontSize: "32px",
                        fontWeight: 500,
                        color: "rgba(156, 163, 175, 1)",
                        margin: 0,
                        lineHeight: 1.2,
                    }}
                >
                    {versionCompare}
                </div>

                {/* Stats */}
                <div
                    style={{
                        display: "flex",
                        gap: "32px",
                        marginTop: "16px",
                    }}
                >
                    {/* Files changed */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                fontSize: "48px",
                                fontWeight: 700,
                                color: "rgba(147, 197, 253, 1)",
                            }}
                        >
                            {files.length}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                fontSize: "18px",
                                color: "rgba(156, 163, 175, 1)",
                            }}
                        >
                            files
                        </div>
                    </div>

                    {/* Additions */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                fontSize: "48px",
                                fontWeight: 700,
                                color: "rgba(34, 197, 94, 1)",
                            }}
                        >
                            +{formatNumber(additions)}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                fontSize: "18px",
                                color: "rgba(156, 163, 175, 1)",
                            }}
                        >
                            additions
                        </div>
                    </div>

                    {/* Deletions */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                fontSize: "48px",
                                fontWeight: 700,
                                color: "rgba(239, 68, 68, 1)",
                            }}
                        >
                            -{formatNumber(deletions)}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                fontSize: "18px",
                                color: "rgba(156, 163, 175, 1)",
                            }}
                        >
                            deletions
                        </div>
                    </div>
                </div>

                {/* Badges */}
                {!!(hasProvenance || hasTrustedPublisher) && (
                    <div
                        style={{
                            display: "flex",
                            gap: "16px",
                            marginTop: "24px",
                        }}
                    >
                        {!!hasProvenance && (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    backgroundColor: "rgba(34, 197, 94, 0.15)",
                                    border: "2px solid rgba(34, 197, 94, 0.4)",
                                    borderRadius: "8px",
                                    padding: "8px 16px",
                                }}
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="rgba(34, 197, 94, 1)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M9 12l2 2 4-4" />
                                    <circle cx="12" cy="12" r="10" />
                                </svg>
                                <span
                                    style={{
                                        display: "flex",
                                        color: "rgba(134, 239, 172, 1)",
                                        fontSize: "18px",
                                        fontWeight: 600,
                                    }}
                                >
                                    Provenance
                                </span>
                            </div>
                        )}
                        {!!hasTrustedPublisher && (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    backgroundColor: "rgba(59, 130, 246, 0.15)",
                                    border: "2px solid rgba(59, 130, 246, 0.4)",
                                    borderRadius: "8px",
                                    padding: "8px 16px",
                                }}
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="rgba(59, 130, 246, 1)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                                </svg>
                                <span
                                    style={{
                                        display: "flex",
                                        color: "rgba(147, 197, 253, 1)",
                                        fontSize: "18px",
                                        fontWeight: 600,
                                    }}
                                >
                                    Trusted Publisher
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div
                style={{
                    display: "flex",
                    position: "absolute",
                    bottom: 40,
                    left: 80,
                    fontSize: "32px",
                    fontWeight: 600,
                    color: "rgba(156, 163, 175, 1)",
                }}
            >
                npm-diff.app
            </div>
        </div>,
        {
            width: 1200,
            height: 630,
        },
    );
}
