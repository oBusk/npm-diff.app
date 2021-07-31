import { forwardRef } from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import BorderBox, { BorderBoxProps } from "../BorderBox";
import CollapsableBorderBoxHeader from "./CollapsableBorderBoxHeader";

export interface CollapsableBorderBoxProps extends BorderBoxProps {
    /** Shown next to the `>` togggle button */
    header?: ReactNode;
}

/** A borderbox with a header that has `>` button to collapse the box, hiding `children`. */
const CollapsableBorderBox = forwardRef<CollapsableBorderBoxProps, "div">(
    ({ header, title, children, ...props }, ref) => {
        const [isExpanded, setIsExpanded] = useState(true);

        return (
            <BorderBox padding={0} {...props}>
                <CollapsableBorderBoxHeader
                    isExpanded={isExpanded}
                    toggleIsExpanded={() => setIsExpanded(!isExpanded)}
                >
                    {header}
                </CollapsableBorderBoxHeader>
                {isExpanded && children}
            </BorderBox>
        );
    },
);

export default CollapsableBorderBox;
