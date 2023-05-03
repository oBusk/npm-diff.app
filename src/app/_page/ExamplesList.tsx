import Link from "next/link";
import { ElementRef, forwardRef } from "react";
import Stack, { StackProps } from "^/components/ui/Stack";
import EXAMPLES from "^/lib/examples";
import { QueryParams } from "^/lib/query";

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
            <Stack align="center" {...props} ref={ref}>
                <h2 className="text-xl font-bold">Examples</h2>
                {EXAMPLES.map((ex) => (
                    <Link
                        className="my-1 hover:underline"
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
