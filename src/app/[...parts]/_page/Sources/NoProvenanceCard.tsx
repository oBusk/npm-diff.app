import { CircleQuestionMark, X } from "lucide-react";

export interface NoProvenanceCardProps {
    unavailable?: boolean;
}

export function NoProvenanceCard({ unavailable }: NoProvenanceCardProps) {
    const Icon = unavailable ? CircleQuestionMark : X;

    return (
        <div className="flex flex-col items-center justify-center px-8 py-12 text-muted-foreground">
            <Icon
                className="mx-auto mb-2 size-24 text-muted-foreground"
                aria-hidden="true"
            />
            <p>
                {unavailable
                    ? "Couldn't load provenance information"
                    : "Released without provenance"}
            </p>
        </div>
    );
}
