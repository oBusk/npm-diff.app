import { X } from "lucide-react";

export function NoProvenanceCard() {
    return (
        <div className="flex flex-col items-center justify-center px-8 py-12 text-muted-foreground">
            <X
                className="mx-auto mb-2 size-24 text-muted-foreground"
                aria-hidden="true"
            />
            <p>Released without provenance</p>
        </div>
    );
}
