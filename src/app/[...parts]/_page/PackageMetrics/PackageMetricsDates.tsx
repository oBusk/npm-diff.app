import { cacheLife } from "next/cache";
import Skeleton from "^/components/ui/Skeleton";
import getVersionData from "^/lib/api/npm/getVersionData";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import suspense from "^/lib/suspense";
import formatReleaseDate from "../formatReleaseDate";

export interface PackageMetricsDatesProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
}

async function PackageMetricsDates({ a, b }: PackageMetricsDatesProps) {
    "use cache";

    cacheLife("hours");

    const [versionsA, versionsB] = await Promise.all([
        getVersionData(a),
        getVersionData(b),
    ]);

    const timeA = versionsA[a.version]?.time;
    const timeB = versionsB[b.version]?.time;

    if (!timeA || !timeB) {
        return null;
    }

    return (
        <span className="font-mono text-xs text-faint">
            {formatReleaseDate(new Date(timeA))} →{" "}
            {formatReleaseDate(new Date(timeB))}
        </span>
    );
}

function PackageMetricsDatesFallback() {
    return <Skeleton className="h-4 w-32" />;
}

export default suspense(PackageMetricsDates, PackageMetricsDatesFallback);
