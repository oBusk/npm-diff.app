import { Loader2 } from "lucide-react";
import { forwardRef } from "react";
import Button from "^/components/ui/Button";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading: boolean;
    a: string;
}

const DiffButton = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ isLoading, a, ...props }, ref) => {
        return (
            <Button
                type="submit"
                variant="secondary"
                size="default"
                disabled={!a || isLoading}
                className="relative overflow-hidden"
                ref={ref}
                {...props}
            >
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : null}
                <span className={isLoading ? "invisible" : undefined}>
                    npm diff! 📦🔃
                </span>
            </Button>
        );
    },
);
DiffButton.displayName = "DiffButton";

export default DiffButton;
