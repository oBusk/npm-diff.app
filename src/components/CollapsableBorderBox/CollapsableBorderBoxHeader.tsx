import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { type ComponentProps, forwardRef } from "react";
import Tooltip from "^/components/ui/Tooltip";
import { cx } from "^/lib/cva";
import Button from "../ui/Button";

export interface CollapsableBorderBoxHeaderProps extends ComponentProps<"div"> {
    isExpanded: boolean;
    toggleIsExpanded: () => void;
}

const CollapsableBorderBoxHeader = forwardRef<
    HTMLDivElement,
    CollapsableBorderBoxHeaderProps
>(
    (
        { isExpanded, toggleIsExpanded, title, children, className, ...props },
        ref,
    ) => {
        const label = isExpanded ? "Collapse" : "Expand";

        return (
            <div
                className={cx(
                    "flex items-center rounded-t-xl bg-muted px-3 py-2.5",
                    isExpanded && "border-b border-line",
                    className!,
                )}
                {...props}
                ref={ref}
            >
                <Tooltip label={label}>
                    <Button
                        size="xs"
                        variant="secondary"
                        onClick={toggleIsExpanded}
                        aria-label={label}
                        className="mr-2.5 rounded-md border border-accent bg-transparent p-[3px] hover:bg-accent"
                    >
                        {isExpanded ? (
                            <ChevronDownIcon className="stroke-current" />
                        ) : (
                            <ChevronRightIcon className="stroke-current" />
                        )}
                    </Button>
                </Tooltip>
                {children}
            </div>
        );
    },
);
CollapsableBorderBoxHeader.displayName = "CollapsableBorderBoxHeader";

export default CollapsableBorderBoxHeader;
