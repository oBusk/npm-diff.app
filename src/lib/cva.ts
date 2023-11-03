import {
    type CxOptions,
    type CxReturn,
    cva as originalCva,
    cx as originalCx,
    type VariantProps,
} from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export type { VariantProps, CxOptions, CxReturn };

export const cva: typeof originalCva = (base, config) => {
    const variants = originalCva(base, config);

    return (props) => twMerge(variants(props));
};

export const cx: typeof originalCx = (...inputs) => twMerge(originalCx(inputs));
