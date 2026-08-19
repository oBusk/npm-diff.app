import { cacheLife } from "next/cache";
import { type ReactNode } from "react";
import Skeleton from "^/components/ui/Skeleton";
import getVersionData from "^/lib/api/npm/getVersionData";
import { gitDiffParse } from "^/lib/gitDiff";
import npmDiff, { type NpmDiffOptions } from "^/lib/npmDiff";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import suspense from "^/lib/suspense";
import countChanges from "^/lib/utils/countChanges";
import formatReleaseDate from "../formatReleaseDate";

export interface DiffSummaryLineProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    specs: [string, string];
    options: NpmDiffOptions;
}

async function DiffSummaryLine({ a, b, specs, options }: DiffSummaryLineProps) {
    "use cache";

    cacheLife("max");

    const [diff, versionsA, versionsB] = await Promise.all([
        npmDiff(specs, options),
        getVersionData(a),
        getVersionData(b),
    ]);

    const files = gitDiffParse(diff);
    const changes = files.map((file) => countChanges(file.hunks));
    const additions = changes.reduce(
        (sum, { additions }) => sum + additions,
        0,
    );
    const deletions = changes.reduce(
        (sum, { deletions }) => sum + deletions,
        0,
    );

    const timeA = versionsA[a.version]?.time;
    const timeB = versionsB[b.version]?.time;

    let releaseNote: ReactNode = null;
    if (timeA && timeB) {
        const dateA = new Date(timeA);
        const dateB = new Date(timeB);
        const days = Math.round(
            Math.abs(dateB.getTime() - dateA.getTime()) / 86_400_000,
        );

        releaseNote =
            dateB < dateA ? (
                <>
                    runs{" "}
                    <b className="font-semibold text-foreground">
                        backwards in time
                    </b>{" "}
                    ({formatReleaseDate(dateA)} → {formatReleaseDate(dateB)})
                </>
            ) : (
                <>
                    released{" "}
                    <b className="font-semibold text-foreground">
                        {days} days apart
                    </b>
                </>
            );
    }

    return (
        <p className="text-sm leading-[21px] text-muted-foreground">
            <b className="font-semibold text-foreground">
                {files.length} files
            </b>{" "}
            changed · <span className="text-add">+{additions}</span>{" "}
            <span className="text-remove">−{deletions}</span>
            {releaseNote ? <> · {releaseNote}</> : null}
        </p>
    );
}

function DiffSummaryLineFallback() {
    return <Skeleton className="h-[21px] w-72" />;
}

export default suspense(DiffSummaryLine, DiffSummaryLineFallback);
