import { Info, ShieldCheck } from "lucide-react";
import Link from "next/link";
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
                    <Tooltip
                        label={
                            <>
                                <p>
                                    Guarantees that this release was published
                                    from a repository configured by the
                                    maintainer
                                </p>
                                <p className="mt-1 text-xs">
                                    Click to read more.
                                </p>
                            </>
                        }
                    >
                        <Link
                            href="/-/about/source-trust"
                            className="rounded-sm p-1 hover:bg-muted/50"
                        >
                            <Info className="size-4 text-muted-foreground" />
                        </Link>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}
