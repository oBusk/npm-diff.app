"use client";

import { ElementRef, forwardRef, ReactNode } from "react";
import { useBoolean } from "react-use";
import BorderBox, { BorderBoxProps } from "^/components/ui/BorderBox";
import { cx } from "^/lib/cva";
import CollapsableBorderBoxHeader from "./CollapsableBorderBoxHeader";

export interface CollapsableBorderBoxProps extends BorderBoxProps {
    /** Shown next to the `>` togggle button */
    header?: ReactNode;
}

/** A borderbox with a header that has `>` button to collapse the box, hiding `children`. */
const CollapsableBorderBox = forwardRef<
    ElementRef<typeof BorderBox>,
    CollapsableBorderBoxProps
>(({ header, title, children, className, ...props }, ref) => {
    const [isExpanded, setIsExpanded] = useBoolean(true);

    return (
        <BorderBox className={cx("p-0", className)} {...props} ref={ref}>
            <CollapsableBorderBoxHeader
                isExpanded={isExpanded}
                toggleIsExpanded={() => setIsExpanded()}
            >
                {header}
            </CollapsableBorderBoxHeader>
            {isExpanded ? (
                <div className="overflow-auto">{children}</div>
            ) : null}
        </BorderBox>
    );
});
CollapsableBorderBox.displayName = "CollapsableBorderBox";

export default CollapsableBorderBox;
