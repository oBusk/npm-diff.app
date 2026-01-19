import { GitCompare } from "lucide-react";
import { cacheLife } from "next/cache";
import ExternalLink from "^/components/ExternalLink";
import Button from "^/components/ui/Button";
import Heading from "^/components/ui/Heading";
import Skeleton from "^/components/ui/Skeleton";
import Tooltip from "^/components/ui/Tooltip";
import { getSourceInformation } from "^/lib/api/npm/sourceInformation";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import suspense from "^/lib/suspense";
import Halfs from "../DiffIntro/Halfs";
import SourceCard from "./SourceCard";

export interface SourcesProps {
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
        <>
            <Halfs
                className="w-full items-center"
                left={
                    sourceA ? <SourceCard sourceInformation={sourceA} /> : <></>
                }
                center={<span className="w-4"></span>}
                right={
                    sourceB ? <SourceCard sourceInformation={sourceB} /> : <></>
                }
            />
            <Halfs
                className="w-full items-center"
                left={<></>}
                center={
                    <span className="p-4">
                        {sourceA &&
                        sourceB &&
                        sourceA.repositoryUrl === sourceB.repositoryUrl ? (
                            sourceA.repositoryUrl.startsWith(
                                "https://github.com",
                            ) ? (
                                <Tooltip
                                    label={
                                        <span className="flex items-center gap-1.5">
                                            <span>Compare</span>
                                            <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
                                                {sourceA.commitHash.substring(
                                                    0,
                                                    8,
                                                )}
                                            </code>
                                            <span>with</span>
                                            <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
                                                {sourceB.commitHash.substring(
                                                    0,
                                                    8,
                                                )}
                                            </code>{" "}
                                            on Github.com
                                        </span>
                                    }
                                >
                                    <Button asChild variant="secondary">
                                        <ExternalLink
                                            href={createGithubCompareHref(
                                                sourceA.repositoryPath,
                                                sourceA.commitHash,
                                                sourceB.commitHash,
                                            )}
                                        >
                                            <GitCompare className="mr-2 size-4" />
                                            Compare Sources
                                        </ExternalLink>
                                    </Button>
                                </Tooltip>
                            ) : sourceA.repositoryUrl.startsWith(
                                  "https://gitlab.com",
                              ) ? (
                                <Tooltip
                                    label={
                                        <span className="flex items-center gap-1.5">
                                            <span>Compare</span>
                                            <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
                                                {sourceA.commitHash.substring(
                                                    0,
                                                    8,
                                                )}
                                            </code>
                                            <span>with</span>
                                            <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
                                                {sourceB.commitHash.substring(
                                                    0,
                                                    8,
                                                )}
                                            </code>{" "}
                                            on GitLab.com
                                        </span>
                                    }
                                >
                                    <Button asChild variant="secondary">
                                        <ExternalLink
                                            href={`${sourceA.repositoryUrl}/-/compare/${sourceA.commitHash}...${sourceB.commitHash}`}
                                        >
                                            <GitCompare className="mr-2 size-4" />
                                            Compare Sources
                                        </ExternalLink>
                                    </Button>
                                </Tooltip>
                            ) : (
                                <></>
                            )
                        ) : (
                            <></>
                        )}
                    </span>
                }
                right={<></>}
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
