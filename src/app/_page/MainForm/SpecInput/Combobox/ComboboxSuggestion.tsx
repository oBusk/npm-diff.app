import { cva, VariantProps } from "class-variance-authority";
import { forwardRef, HTMLAttributes } from "react";
import cn from "^/lib/cn";

const comboboxSuggestionVariants = cva("rounded-sm p-4", {
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
            className={cn(
                comboboxSuggestionVariants({ highlighted, className }),
            )}
            ref={ref}
            {...props}
        />
    ),
);
ComboboxSuggestion.displayName = "ComboboxSuggestion";

export default ComboboxSuggestion;
