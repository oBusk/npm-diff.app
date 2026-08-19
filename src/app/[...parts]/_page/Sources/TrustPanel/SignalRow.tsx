import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";
import { cx } from "^/lib/cva";

export interface SignalRowProps {
    icon: LucideIcon;
    label: string;
    value: ReactNode;
    tone?: "add" | "remove" | "muted";
}

const TONE_CLASS = {
    add: "text-add",
    remove: "text-remove",
    muted: "text-muted-foreground",
} as const;

const ICON_TONE_CLASS = {
    add: "text-add",
    remove: "text-remove",
    muted: "text-faint",
} as const;

const SignalRow = ({
    icon: Icon,
    label,
    value,
    tone = "muted",
}: SignalRowProps) => (
    <div className="flex items-start gap-2">
        <Icon
            className={cx("mt-0.5 size-3.5 shrink-0", ICON_TONE_CLASS[tone])}
        />
        <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-[11px] tracking-[0.08em] text-faint uppercase">
                {label}
            </span>
            <span
                className={cx(
                    "truncate font-mono text-[12.5px]",
                    TONE_CLASS[tone],
                )}
            >
                {value}
            </span>
        </div>
    </div>
);

export default SignalRow;
