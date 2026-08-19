import { cacheLife } from "next/cache";
import {
    auditSourceTrust,
    getSourceInformation,
} from "^/lib/api/npm/sourceInformation";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import { simplePackageSpecToString } from "^/lib/SimplePackageSpec";
import suspense from "^/lib/suspense";
import { TrustAuditFindings } from "./TrustAuditFindings";
import TrustPanel, { TrustPanelSkeleton } from "./TrustPanel";

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

    // Analyze trust only if both packages are the same
    const findings =
        a.name === b.name ? auditSourceTrust(sourceA, sourceB) : [];

    const aLabel = simplePackageSpecToString(a);

    return (
        <div className="flex w-full flex-col gap-4">
            <TrustPanel
                a={a}
                b={b}
                sourceA={sourceA}
                sourceB={sourceB}
                findings={findings}
            />
            <TrustAuditFindings
                findings={findings}
                aLabel={aLabel}
                sourceA={sourceA}
                sourceB={sourceB}
            />
        </div>
    );
}

const SuspendedSources = suspense(Sources, TrustPanelSkeleton);

export default SuspendedSources;
