import { ArrowRight, Loader2 } from "lucide-react";
import { forwardRef } from "react";
import Button from "^/components/ui/Button";
import { cx } from "^/lib/cva";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading: boolean;
    a: string;
}

const DiffButton = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ isLoading, a, ...props }, ref) => {
        return (
            <Button
                type="submit"
                size="default"
                disabled={!a || isLoading}
                className="relative h-11 shrink-0 gap-2 overflow-hidden rounded-[10px] px-[22px] text-[15px] font-semibold"
                ref={ref}
                {...props}
            >
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : null}
                <span
                    className={cx(
                        "flex items-center gap-2",
                        isLoading && "invisible",
                    )}
                >
                    Run diff
                    <ArrowRight className="size-4" />
                </span>
            </Button>
        );
    },
);
DiffButton.displayName = "DiffButton";

export default DiffButton;
