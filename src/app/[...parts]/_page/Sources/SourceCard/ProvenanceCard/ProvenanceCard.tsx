import {
    BadgeCheck,
    ExternalLink as ExternalLinkIcon,
    FileCode,
    ScrollText,
} from "lucide-react";
import { type SourceInformation } from "^/lib/api/npm/sourceInformation";
import ProvenanceCardButton from "./ProvenanceCardButton";

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
                        <div className="text-sm text-muted-foreground">
                            Built and signed on
                        </div>
                        <div className="text-sm font-medium">
                            {sourceInformation.buildPlatform}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <ProvenanceCardButton
                            tooltip={
                                <div className="space-y-1">
                                    <div className="text-xs font-medium">
                                        Build File
                                    </div>
                                    <code className="rounded-sm bg-muted px-1.5 py-0.5 text-xs">
                                        {sourceInformation.buildFileName}
                                    </code>
                                </div>
                            }
                            href={sourceInformation.buildFileHref}
                            Icon={FileCode}
                        />
                        <ProvenanceCardButton
                            tooltip="View transparency log entry"
                            href={sourceInformation.publicLedger}
                            Icon={ScrollText}
                        />
                        <ProvenanceCardButton
                            tooltip="View source repository"
                            href={sourceInformation.buildSummaryUrl}
                            Icon={ExternalLinkIcon}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
