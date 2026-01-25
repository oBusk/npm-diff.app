import { type ReactNode } from "react";
import ExternalLink from "^/components/ExternalLink";
import Button from "^/components/ui/Button";
import Tooltip from "^/components/ui/Tooltip";

export interface ProvenanceCardButtonProps {
    tooltip: ReactNode;
    href: string;
    Icon: React.ComponentType<{ className?: string }>;
}

export default function ProvenanceCardButton({
    tooltip,
    href,
    Icon,
}: ProvenanceCardButtonProps) {
    return (
        <Tooltip label={tooltip}>
            <Button asChild variant="default" size="xs">
                <ExternalLink href={href}>
                    <Icon className="size-4" />
                </ExternalLink>
            </Button>
        </Tooltip>
    );
}
