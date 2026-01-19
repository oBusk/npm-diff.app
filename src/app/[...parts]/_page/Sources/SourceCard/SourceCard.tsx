import { GitCommit, Github, Gitlab } from "lucide-react";
import ExternalLink from "^/components/ExternalLink";
import Heading from "^/components/ui/Heading";
import { type SourceInformation } from "^/lib/api/npm/sourceInformation";
import { cx } from "^/lib/cva";
import ProvenanceCard from "./ProvenanceCard";

export interface SourceCardProps extends React.HTMLProps<HTMLDivElement> {
    sourceInformation: SourceInformation;
}

export default function SourceCard({
    sourceInformation,
    className,
    ...props
}: SourceCardProps) {
    return (
        <div
            className={cx("rounded-xl border border-border", className)}
            {...props}
        >
            <div className="w-full border-b p-2">
                <Heading h={4} className="text-base">
                    Source
                </Heading>
            </div>
            <div className="p-3">
                <div className="space-y-3">
                    <ExternalLink
                        href={sourceInformation.repositoryUrl}
                        className="flex items-center justify-between gap-2 rounded p-2 hover:bg-muted/50"
                    >
                        <span className="text-sm">Repo:</span>
                        <div className="flex items-center gap-1.5">
                            {sourceInformation.repositoryUrl.startsWith(
                                "https://github.com",
                            ) ? (
                                <Github className="size-3.5 shrink-0" />
                            ) : sourceInformation.repositoryUrl.startsWith(
                                  "https://gitlab.com",
                              ) ? (
                                <Gitlab className="size-3.5 shrink-0" />
                            ) : null}
                            <span className="text-sm font-medium">
                                {sourceInformation.repositoryPath}
                            </span>
                        </div>
                    </ExternalLink>
                    <ExternalLink
                        href={`${sourceInformation.repositoryUrl}/tree/${sourceInformation.commitHash}`}
                        className="flex items-center justify-between gap-2 rounded p-2 hover:bg-muted/50"
                    >
                        <span className="text-sm">Commit:</span>
                        <div className="flex items-center gap-1.5">
                            <GitCommit className="size-3.5 shrink-0" />
                            <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-sm">
                                {sourceInformation.commitHash.substring(0, 8)}
                            </code>
                        </div>
                    </ExternalLink>
                    <ProvenanceCard sourceInformation={sourceInformation} />
                </div>
            </div>
        </div>
    );
}
