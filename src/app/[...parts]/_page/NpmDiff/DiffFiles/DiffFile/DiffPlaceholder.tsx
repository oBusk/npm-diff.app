import { ElementRef, forwardRef } from "react";
import Button from "^/components/ui/Button";
import Stack, { StackProps } from "^/components/ui/Stack";
import { cx } from "^/lib/cva";

export interface DiffPlaceholderProps extends StackProps {
    reason?: string;
}

const DiffPlaceholder = forwardRef<
    ElementRef<typeof Stack>,
    DiffPlaceholderProps
>(({ reason, className, ...props }, ref) => (
    <Stack
        align="center"
        className={cx("p-8 cursor-pointer", className)}
        {...props}
        ref={ref}
    >
        <Button variant="secondary">Load Diff</Button>
        {reason ? <span>{reason}</span> : null}
    </Stack>
));
DiffPlaceholder.displayName = "DiffPlaceholder";

export default DiffPlaceholder;
