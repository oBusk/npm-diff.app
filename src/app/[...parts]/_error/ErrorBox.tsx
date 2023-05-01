import { ElementRef, forwardRef } from "react";
import BorderBox, { BorderBoxProps } from "^/components/ui/BorderBox";
import cn from "^/lib/cn";

export interface ErrorBoxProps extends BorderBoxProps {}

const ErrorBox = forwardRef<ElementRef<typeof BorderBox>, ErrorBoxProps>(
    (props, ref) => {
        return (
            <BorderBox
                className={cn("bg-red-200 dark:bg-red-700")}
                {...props}
                ref={ref}
            />
        );
    },
);
ErrorBox.displayName = "ErrorBox";

export default ErrorBox;
