import { cacheLife } from "next/cache";
import ExternalLink from "^/components/ExternalLink";
import Button from "^/components/ui/Button";
import Heading from "^/components/ui/Heading";
import Skeleton from "^/components/ui/Skeleton";
import { getSourceInformation } from "^/lib/api/npm/sourceInformation";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import suspense from "^/lib/suspense";
import Halfs from "./DiffIntro/Halfs";

export interface SourceDiffProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
}

function createGithubCompareHref(
    repository: string,
    commitA: string,
    commitB: string,
) {
    return `${repository}/compare/${commitA}...${commitB}`;
}

async function Sources({ a, b }: SourceDiffProps) {
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
        <>
            <Heading h={3} className="text-lg">
                Sources
            </Heading>
            <Halfs
                className="items-center"
                left={
                    sourceA ? (
                        <ExternalLink
                            href={`${sourceA.repository}/tree/${sourceA.commitHash}`}
                            className="underline"
                        >
                            {sourceA.commitHash.slice(0, 7)}
                        </ExternalLink>
                    ) : (
                        <></>
                    )
                }
                center={
                    <span className="p-4">
                        {sourceA &&
                        sourceB &&
                        sourceA.repository === sourceB.repository ? (
                            <Button asChild variant="secondary">
                                <ExternalLink
                                    href={createGithubCompareHref(
                                        sourceA.repository,
                                        sourceA.commitHash,
                                        sourceB.commitHash,
                                    )}
                                >
                                    Compare
                                </ExternalLink>
                            </Button>
                        ) : (
                            <></>
                        )}
                    </span>
                }
                right={
                    sourceB ? (
                        <ExternalLink
                            href={`${sourceB.repository}/tree/${sourceB.commitHash}`}
                            className="underline"
                        >
                            {sourceB.commitHash.slice(0, 7)}
                        </ExternalLink>
                    ) : (
                        <></>
                    )
                }
            />
        </>
    );
}

function SourcesFallback() {
    return (
        <>
            <Heading h={3} className="text-lg">
                Sources
            </Heading>
            <Halfs
                className="items-center"
                left={<Skeleton className="h-5 w-16" />}
                center={
                    <span className="p-4">
                        <Skeleton className="h-8 w-20" />
                    </span>
                }
                right={<Skeleton className="h-5 w-16" />}
            />
        </>
    );
}

const SuspendedSources = suspense(Sources, SourcesFallback);

export default SuspendedSources;
