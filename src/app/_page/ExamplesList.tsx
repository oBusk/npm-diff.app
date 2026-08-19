import Link from "next/link";
import { type ElementRef, forwardRef } from "react";
import Stack, { type StackProps } from "^/components/ui/Stack";
import { cx } from "^/lib/cva";
import EXAMPLES from "^/lib/examples";
import { type QueryParams } from "^/lib/query";

export interface ExamplesListProps extends StackProps {
    exampleMouseOver: (a: string, b: string) => void;
    exampleMouseOut: () => void;
    exampleClicked: () => void;
    queryParams: QueryParams;
}

const ExamplesList = forwardRef<ElementRef<typeof Stack>, ExamplesListProps>(
    (
        {
            exampleMouseOver,
            exampleMouseOut: onMouseOut,
            exampleClicked: onClick,
            queryParams: query,
            ...props
        },
        ref,
    ) => {
        const onMouseOver = (example: string) => {
            const [a, b] = example.split("...");

            exampleMouseOver(a, b);
        };

        return (
            <Stack
                direction="h"
                align="center"
                justify="center"
                className="flex-wrap gap-2"
                {...props}
                ref={ref}
            >
                <span className="mr-1 font-mono text-xs tracking-[0.06em] text-faint uppercase">
                    Try
                </span>
                {EXAMPLES.map((ex) => (
                    <Link
                        className={cx(
                            "border-line text-secondary-foreground hover:border-line-strong hover:text-foreground",
                            "rounded-full border px-3 py-1.5 font-mono text-[12.5px]",
                        )}
                        key={ex}
                        href={{
                            pathname: `/${ex}`,
                            query: { ...query },
                        }}
                        onMouseOver={() => onMouseOver(ex)}
                        onMouseOut={() => onMouseOut()}
                        onClick={() => onClick()}
                    >
                        {ex}
                    </Link>
                ))}
            </Stack>
        );
    },
);
ExamplesList.displayName = "ExamplesList";

export default ExamplesList;
