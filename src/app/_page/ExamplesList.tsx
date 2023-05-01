import Link from "next/link";
import { forwardRef, HTMLAttributes } from "react";
import cn from "^/lib/cn";
import EXAMPLES from "^/lib/examples";
import { QueryParams } from "^/lib/query";

export interface ExamplesListProps extends HTMLAttributes<HTMLDivElement> {
    exampleMouseOver: (a: string, b: string) => void;
    exampleMouseOut: () => void;
    exampleClicked: () => void;
    queryParams: QueryParams;
}

const ExamplesList = forwardRef<HTMLDivElement, ExamplesListProps>(
    (
        {
            exampleMouseOver,
            exampleMouseOut: onMouseOut,
            exampleClicked: onClick,
            queryParams: query,
            className,
            ...props
        },
        ref,
    ) => {
        const onMouseOver = (example: string) => {
            const [a, b] = example.split("...");

            exampleMouseOver(a, b);
        };

        return (
            <section
                className={cn("flex flex-col items-center", className)}
                {...props}
                ref={ref}
            >
                <h2 className={cn("text-xl font-bold")}>Examples</h2>
                {EXAMPLES.map((ex) => (
                    <Link
                        className={cn("my-1 hover:underline")}
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
            </section>
        );
    },
);
ExamplesList.displayName = "ExamplesList";

export default ExamplesList;
