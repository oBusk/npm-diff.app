import { type ElementRef, forwardRef } from "react";
import Button from "^/components/ui/Button";
import Stack, { type StackProps } from "^/components/ui/Stack";
import { cx } from "^/lib/cva";

export interface DiffPlaceholderProps extends StackProps {
    reason?: string;
}

const DiffPlaceholder = forwardRef<
    ElementRef<typeof Stack>,
    DiffPlaceholderProps
>(({ reason, className, ...props }, ref) => (
    <Stack
        direction="h"
        align="center"
        justify="center"
        gap={3}
        className={cx("cursor-pointer bg-background p-[26px]", className!)}
        {...props}
        ref={ref}
    >
        {reason ? (
            <span className="text-[13px] text-muted-foreground">{reason}</span>
        ) : null}
        <Button
            variant="secondary"
            className="h-[30px] rounded-lg border border-line-strong bg-secondary text-[13px]"
        >
            Load diff
        </Button>
    </Stack>
));
DiffPlaceholder.displayName = "DiffPlaceholder";

export default DiffPlaceholder;
