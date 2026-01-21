import { X } from "lucide-react";
import Heading from "^/components/ui/Heading";
import { cx } from "^/lib/cva";

export type NeitherHasProvenanceProps = React.HTMLProps<HTMLDivElement>;

export function NeitherHasProvenance({
    className,
    ...props
}: NeitherHasProvenanceProps) {
    return (
        <div
            className={cx("rounded-xl border border-border", className)}
            {...props}
        >
            <div className="w-full border-b p-2">
                <Heading h={4} className="text-base">
                    Source
                </Heading>
            </div>
            <div className="flex flex-col items-center justify-center p-4 text-muted-foreground">
                <X
                    className="mx-auto mb-1 size-20 text-muted-foreground"
                    aria-hidden="true"
                />
                <p>Neither release has provenance information</p>
            </div>
        </div>
    );
}
