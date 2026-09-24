import { CircleQuestionMark } from "lucide-react";

export function ProvenanceUnavailableCard() {
    return (
        <div className="flex flex-col items-center justify-center px-8 py-12 text-muted-foreground">
            <CircleQuestionMark
                className="mx-auto mb-2 size-24 text-muted-foreground"
                aria-hidden="true"
            />
            <p>Couldn&apos;t load provenance information</p>
        </div>
    );
}
