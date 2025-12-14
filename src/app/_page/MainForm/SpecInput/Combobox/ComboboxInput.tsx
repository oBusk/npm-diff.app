import { type ElementRef, forwardRef } from "react";
import Input, { type InputProps } from "^/components/ui/Input";
import { cva, type VariantProps } from "^/lib/cva";

const comboboxInputVariants = cva(null, {
    variants: {
        isOpen: {
            true: "rounded-b-none",
        },
    },
});

export interface ComboboxInputProps
    extends InputProps, VariantProps<typeof comboboxInputVariants> {}

const ComboboxInput = forwardRef<ElementRef<typeof Input>, ComboboxInputProps>(
    ({ isOpen, className, ...props }, ref) => (
        <Input
            type="text"
            ring={false}
            className={comboboxInputVariants({ isOpen, className })}
            ref={ref}
            {...props}
        />
    ),
);
ComboboxInput.displayName = "ComboboxInput";

export default ComboboxInput;
