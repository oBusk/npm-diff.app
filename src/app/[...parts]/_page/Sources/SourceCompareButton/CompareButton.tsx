import { GitCompare } from "lucide-react";
import ExternalLink from "^/components/ExternalLink";
import Button from "^/components/ui/Button";
import Tooltip from "^/components/ui/Tooltip";

export interface CompareButtonProps {
    commitA: string;
    commitB: string;
    compareUrl: string;
    serviceName: string;
}

function HashBlock({ hash }: { hash: string }) {
    return (
        <code className="inline rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
            {hash.substring(0, 8)}
        </code>
    );
}

export function CompareButton({
    commitA,
    commitB,
    compareUrl,
    serviceName,
}: CompareButtonProps) {
    return (
        <Tooltip
            label={
                <span>
                    Compare <HashBlock hash={commitA} /> with{" "}
                    <HashBlock hash={commitB} /> on {serviceName}
                </span>
            }
        >
            <Button asChild variant="secondary">
                <ExternalLink href={compareUrl}>
                    <GitCompare className=" size-4" />
                </ExternalLink>
            </Button>
        </Tooltip>
    );
}
