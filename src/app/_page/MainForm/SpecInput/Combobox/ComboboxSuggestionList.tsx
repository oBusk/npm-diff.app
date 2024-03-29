import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "^/lib/cva";

export interface ComboboxSuggestionListProps
    extends HTMLAttributes<HTMLUListElement> {}

const ComboboxSuggestionList = forwardRef<
    HTMLUListElement,
    ComboboxSuggestionListProps
>(({ className, ...props }, ref) => (
    <ul
        className={cx(
            "p-1",
            "bg-background shadow-2xl",
            "border border-t-0",
            "overflow-hidden rounded-b-lg",
            "absolute inset-x-0",
            "z-[1]",
            "list-none",
            "empty:invisible",
            className,
        )}
        ref={ref}
        {...props}
    />
));
ComboboxSuggestionList.displayName = "ComboboxSuggestionList";

export default ComboboxSuggestionList;
