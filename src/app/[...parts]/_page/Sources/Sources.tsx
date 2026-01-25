import { cacheLife } from "next/cache";
import Skeleton from "^/components/ui/Skeleton";
import {
    auditSourceTrust,
    getSourceInformation,
} from "^/lib/api/npm/sourceInformation";
import { cx } from "^/lib/cva";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import { simplePackageSpecToString } from "^/lib/SimplePackageSpec";
import suspense from "^/lib/suspense";
import Halfs from "../DiffIntro/Halfs";
import { NeitherHasProvenance } from "./NeitherHasProvenance";
import { NoProvenanceCard } from "./NoProvenanceCard";
import SourceCard from "./SourceCard";
import SourceCompareButton from "./SourceCompareButton";
import { TrustAuditFindings } from "./TrustAuditFindings";

export interface SourcesProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
}

async function Sources({ a, b }: SourcesProps) {
    "use cache";

    cacheLife("hours");

    const [sourceA, sourceB] = await Promise.all([
        getSourceInformation(a),
        getSourceInformation(b),
    ]);

    if (!sourceA && !sourceB) {
        return <NeitherHasProvenance className="mb-4" />;
    }

    // Analyze trust only if both packages are the same
    const findings =
        a.name === b.name ? auditSourceTrust(sourceA, sourceB) : [];

    const aLabel = simplePackageSpecToString(a);

    return (
        <Halfs
            className={cx(
                "mb-4 w-full",
                findings.length > 0 &&
                    "rounded-xl bg-gradient-to-b from-red-900/50 via-transparent to-transparent p-0.5",
            )}
            left={
                <div className="flex w-full max-w-md flex-col gap-2">
                    {sourceA ? (
                        <SourceCard sourceInformation={sourceA} />
                    ) : (
                        <NoProvenanceCard />
                    )}
                </div>
            }
            center={
                sourceA && sourceB ? (
                    <span className="p-4">
                        <SourceCompareButton
                            sourceA={sourceA}
                            sourceB={sourceB}
                        />
                    </span>
                ) : null
            }
            right={
                <div className="flex w-full max-w-md flex-col gap-2">
                    {sourceB ? (
                        <SourceCard sourceInformation={sourceB} />
                    ) : null}
                    <TrustAuditFindings
                        findings={findings}
                        aLabel={aLabel}
                        sourceA={sourceA}
                        sourceB={sourceB}
                    />
                </div>
            }
        />
    );
}

function SourcesFallback() {
    return (
        <Halfs
            className="mb-4 w-full items-center"
            left={<Skeleton className="h-4 w-12 rounded-md" />}
            center={null}
            right={<Skeleton className="h-4 w-12 rounded-md" />}
        />
    );
}

const SuspendedSources = suspense(Sources, SourcesFallback);

export default SuspendedSources;
