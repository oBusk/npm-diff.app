"use client";

import { PencilLine, Repeat2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { forwardRef, type HTMLAttributes } from "react";
import Button from "^/components/ui/Button";
import { cx } from "^/lib/cva";
import specsToDiff from "^/lib/utils/specsToDiff";

export interface TitleActionsProps extends HTMLAttributes<HTMLDivElement> {
    specs: [string, string];
}

const ACTION_CLASS = "h-[34px] gap-1.5 rounded-lg text-sm";

const TitleActions = forwardRef<HTMLDivElement, TitleActionsProps>(
    ({ specs, className, ...props }, ref) => {
        const searchParams = useSearchParams();
        const query = Object.fromEntries(searchParams.entries());

        return (
            <div
                className={cx("flex items-center gap-2", className!)}
                ref={ref}
                {...props}
            >
                <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className={ACTION_CLASS}
                >
                    <Link
                        href={{
                            pathname: `/${specsToDiff([specs[1], specs[0]])}`,
                            query,
                        }}
                        prefetch={false}
                    >
                        <Repeat2 className="size-3.5" />
                        Swap
                    </Link>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className={ACTION_CLASS}
                >
                    <Link href="/" prefetch={false}>
                        <PencilLine className="size-3.5" />
                        Change versions
                    </Link>
                </Button>
            </div>
        );
    },
);
TitleActions.displayName = "TitleActions";

export default TitleActions;
