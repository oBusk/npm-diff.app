import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "^/lib/cva";

const comboboxSuggestionVariants = cva("cursor-pointer rounded-sm p-4", {
    variants: {
        highlighted: {
            true: "bg-accent text-accent-foreground",
        },
    },
});

export interface ComboboxSuggestionProps
    extends HTMLAttributes<HTMLLIElement>,
        VariantProps<typeof comboboxSuggestionVariants> {}

const ComboboxSuggestion = forwardRef<HTMLLIElement, ComboboxSuggestionProps>(
    ({ highlighted, className, ...props }, ref) => (
        <li
            className={comboboxSuggestionVariants({ highlighted, className })}
            ref={ref}
            {...props}
        />
    ),
);
ComboboxSuggestion.displayName = "ComboboxSuggestion";

export default ComboboxSuggestion;
