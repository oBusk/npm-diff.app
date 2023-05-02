import { cva, VariantProps } from "class-variance-authority";
import { ElementRef, forwardRef } from "react";
import Input, { InputProps } from "^/components/ui/Input";
import cn from "^/lib/cn";

const comboboxInputVariants = cva(null, {
    variants: {
        isOpen: {
            true: "rounded-b-none",
        },
    },
});

export interface ComboboxInputProps
    extends InputProps,
        VariantProps<typeof comboboxInputVariants> {}

const ComboboxInput = forwardRef<ElementRef<typeof Input>, ComboboxInputProps>(
    ({ isOpen, className, ...props }, ref) => (
        <Input
            type="text"
            ring={false}
            className={cn(comboboxInputVariants({ isOpen, className }))}
            ref={ref}
            {...props}
        />
    ),
);
ComboboxInput.displayName = "ComboboxInput";

export default ComboboxInput;
