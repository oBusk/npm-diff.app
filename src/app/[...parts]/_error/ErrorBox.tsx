import { type ElementRef, forwardRef } from "react";
import BorderBox, { type BorderBoxProps } from "^/components/ui/BorderBox";
import { cx } from "^/lib/cva";

export interface ErrorBoxProps extends BorderBoxProps {}

const ErrorBox = forwardRef<ElementRef<typeof BorderBox>, ErrorBoxProps>(
    ({ className, ...props }, ref) => {
        return (
            <BorderBox
                className={cx("bg-red-200 dark:bg-red-700", className)}
                {...props}
                ref={ref}
            />
        );
    },
);
ErrorBox.displayName = "ErrorBox";

export default ErrorBox;
