import { cacheLife } from "next/cache";
import Skeleton from "^/components/ui/Skeleton";
import { getSourceInformation } from "^/lib/api/npm/sourceInformation";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import suspense from "^/lib/suspense";
import Halfs from "../DiffIntro/Halfs";
import SourceCard from "./SourceCard";
import SourceCompareButton from "./SourceCompareButton";

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
        return null;
    }

    return (
        <Halfs
            className="mb-4 w-full items-center"
            left={sourceA ? <SourceCard sourceInformation={sourceA} /> : <></>}
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
            right={sourceB ? <SourceCard sourceInformation={sourceB} /> : <></>}
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
