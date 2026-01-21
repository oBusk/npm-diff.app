import { Info, ShieldCheck } from "lucide-react";
import Tooltip from "^/components/ui/Tooltip";
import { type SourceInformation } from "^/lib/api/npm/sourceInformation";

export interface TrustedPublisherCardProps {
    sourceInformation: SourceInformation;
}

export function TrustedPublisherCard({
    sourceInformation,
}: TrustedPublisherCardProps) {
    if (!sourceInformation.trustedPublisher) {
        return null;
    }

    return (
        <div className="space-y-2 rounded-lg border border-border bg-muted p-3">
            <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-yellow-500" />
                <div className="flex flex-1 items-center justify-between text-sm text-muted-foreground">
                    <span>Trusted Publishing</span>
                    <Tooltip label="This release was published using npm Trusted Publishing (OIDC from CI), without long-lived tokens or secrets">
                        <Info className="size-4 text-muted-foreground" />
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}
