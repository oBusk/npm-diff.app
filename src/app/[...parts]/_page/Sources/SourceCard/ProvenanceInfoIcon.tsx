import { Info } from "lucide-react";
import Link from "next/link";
import Tooltip from "^/components/ui/Tooltip";

export function ProvenanceInfoIcon() {
    return (
        <Tooltip
            label={
                <>
                    <p>
                        Provenance links a package to its source repository and
                        build environment.
                    </p>
                    <p className="mt-1 text-xs">Click to read more.</p>
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
    );
}
