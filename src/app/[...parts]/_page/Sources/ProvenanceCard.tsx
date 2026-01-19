import {
    BadgeCheck,
    ExternalLink as ExternalLinkIcon,
    FileCode,
    ScrollText,
} from "lucide-react";
import ExternalLink from "^/components/ExternalLink";
import Button from "^/components/ui/Button";
import Tooltip from "^/components/ui/Tooltip";
import { type SourceInformation } from "^/lib/api/npm/sourceInformation/sourceInformation";

export interface ProvenanceCardProps {
    sourceInformation: SourceInformation;
}

export default function ProvenanceCard({
    sourceInformation,
}: ProvenanceCardProps) {
    return (
        <div className="space-y-2 rounded-lg border border-border bg-muted p-3">
            <div className="flex items-start gap-3">
                <BadgeCheck className="mt-0.5 size-5 shrink-0 text-green-600" />
                <div className="flex-1 space-y-2">
                    <div>
                        <div className="text-sm font-medium">
                            Built and signed on
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {sourceInformation.buildPlatform}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Tooltip
                            label={
                                <div className="space-y-1">
                                    <div className="text-xs font-medium">
                                        Build File
                                    </div>
                                    <code className="rounded-sm bg-muted px-1.5 py-0.5 text-xs">
                                        {sourceInformation.buildFileName}
                                    </code>
                                </div>
                            }
                        >
                            <Button asChild variant="default" size="xs">
                                <ExternalLink
                                    href={sourceInformation.buildFileHref}
                                >
                                    <FileCode className="size-4" />
                                </ExternalLink>
                            </Button>
                        </Tooltip>
                        <Tooltip label="Transparency log entry">
                            <Button asChild variant="default" size="xs">
                                <ExternalLink
                                    href={sourceInformation.publicLedger}
                                >
                                    <ScrollText className="size-4" />
                                </ExternalLink>
                            </Button>
                        </Tooltip>
                        <Tooltip label="View build summary">
                            <Button asChild variant="default" size="xs">
                                <ExternalLink
                                    href={sourceInformation.buildSummaryUrl}
                                >
                                    <ExternalLinkIcon className="size-4" />
                                </ExternalLink>
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    );
}
