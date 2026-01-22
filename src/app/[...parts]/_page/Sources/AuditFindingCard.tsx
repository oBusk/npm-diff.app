import { TriangleAlert } from "lucide-react";
import { cx } from "^/lib/cva";

export interface AuditFindingCardProps {
    severity: "red" | "yellow";
    title: string;
    subtitle: string;
}

export function AuditFindingCard({
    severity,
    title,
    subtitle,
}: AuditFindingCardProps) {
    return (
        <div
            className={cx(
                "flex items-center gap-2 rounded-xl border p-3",
                severity === "red" && "border-red-600 bg-red-950",
                severity === "yellow" && "border-yellow-600 bg-yellow-950",
            )}
        >
            <TriangleAlert className="size-6 text-current" aria-hidden="true" />
            <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
        </div>
    );
}
