import { GitCommit, Github, Gitlab } from "lucide-react";
import ExternalLink from "^/components/ExternalLink";
import Heading from "^/components/ui/Heading";
import { type SourceInformation } from "^/lib/api/npm/sourceInformation";
import { cx } from "^/lib/cva";
import { isGitHubUrl, isGitLabUrl } from "^/lib/utils/isAllowedRepositoryHost";
import ProvenanceCard from "./ProvenanceCard";
import { ProvenanceInfoIcon } from "./ProvenanceInfoIcon";
import { TrustedPublisherCard } from "./TrustedPublisherCard";

export interface SourceCardProps extends React.ComponentProps<"div"> {
    sourceInformation: SourceInformation & {
        provenance: NonNullable<SourceInformation["provenance"]>;
    };
}

export default function SourceCard({
    sourceInformation,
    className,
    ...props
}: SourceCardProps) {
    const { provenance } = sourceInformation;

    return (
        <div
            className={cx(
                "rounded-xl border border-border",
                "bg-linear-to-b from-blue-900/25 via-background to-background",
                className!,
            )}
            {...props}
        >
            <div className="flex w-full items-center justify-between border-b p-2">
                <Heading h={4} className="text-base">
                    Source
                </Heading>
                <ProvenanceInfoIcon />
            </div>
            <div className="p-3">
                <div className="space-y-3">
                    <ExternalLink
                        href={provenance.repositoryUrl}
                        className="flex items-center justify-between gap-2 rounded p-2 hover:bg-muted/50"
                    >
                        <span className="text-sm">Repo:</span>
                        <div className="flex items-center gap-1.5">
                            {isGitHubUrl(provenance.repositoryUrl) ? (
                                <Github className="size-3.5 shrink-0" />
                            ) : isGitLabUrl(provenance.repositoryUrl) ? (
                                <Gitlab className="size-3.5 shrink-0" />
                            ) : null}
                            <span className="text-sm font-medium">
                                {provenance.repositoryPath}
                            </span>
                        </div>
                    </ExternalLink>
                    <ExternalLink
                        href={`${provenance.repositoryUrl}/tree/${provenance.commitHash}`}
                        className="flex items-center justify-between gap-2 rounded p-2 hover:bg-muted/50"
                    >
                        <span className="text-sm">Commit:</span>
                        <div className="flex items-center gap-1.5">
                            <GitCommit className="size-3.5 shrink-0" />
                            <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-sm">
                                {provenance.commitHash.substring(0, 8)}
                            </code>
                        </div>
                    </ExternalLink>
                    <ProvenanceCard provenance={provenance} />
                    <TrustedPublisherCard
                        sourceInformation={sourceInformation}
                    />
                </div>
            </div>
        </div>
    );
}
