import {
    type ComponentProps,
    type ElementType,
    forwardRef,
    type ReactNode,
} from "react";
import Skeleton from "^/components/ui/Skeleton";
import Tooltip from "^/components/ui/Tooltip";
import { cva, cx, type VariantProps } from "^/lib/cva";

const flagVariants = cva(
    "mx-1 my-2 flex cursor-help rounded-md bg-muted p-1.5 text-xs text-muted-foreground",
    {
        variants: {
            color: {
                default: "bg-muted text-muted-foreground",
                green: "bg-success text-success-foreground",
                red: "bg-destructive text-destructive-foreground",
            },
        },
        defaultVariants: {
            color: "default",
        },
    },
);

interface FlagProps
    extends Omit<ComponentProps<"div">, "color">,
        VariantProps<typeof flagVariants> {
    Icon: ElementType;
    label: string;
    tooltip?: ReactNode;
}

const Flag = forwardRef<HTMLDivElement, FlagProps>(
    ({ label, Icon, tooltip, color, className, ...props }, ref) => {
        const tag = (
            <div
                className={flagVariants({
                    color,
                    className,
                })}
                {...props}
                ref={ref}
            >
                <Icon className="mr-1 inline-block size-4 fill-current" />{" "}
                {label}
            </div>
        );

        if (tooltip == null) {
            return tag;
        }

        return (
            /* TODO(#805) closeOnClick={false} */
            <Tooltip label={tooltip}>{tag}</Tooltip>
        );
    },
);
Flag.displayName = "Flag";

export default Flag;

export const FlagSkeleton = () => (
    <Skeleton className={cx(flagVariants(), "h-7 w-28")} />
);
