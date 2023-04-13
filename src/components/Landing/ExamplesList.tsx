import { Link } from "@chakra-ui/next-js";
import { Heading, Stack, StackProps } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import EXAMPLES from "^/lib/examples";
import { QueryParams } from "^/lib/query";

export interface ExamplesListProps extends StackProps {
    exampleMouseOver: (a: string, b: string) => void;
    exampleMouseOut: () => void;
    exampleClicked: () => void;
    queryParams: QueryParams;
}

const ExamplesList: FunctionComponent<ExamplesListProps> = ({
    exampleMouseOver,
    exampleMouseOut: onMouseOut,
    exampleClicked: onClick,
    queryParams: query,
    ...props
}) => {
    const onMouseOver = (example: string) => {
        const [a, b] = example.split("...");

        exampleMouseOver(a, b);
    };

    return (
        <Stack align="center" fontSize="sm" {...props}>
            <Heading color="gray.300" size="md">
                Examples
            </Heading>
            {EXAMPLES.map((ex) => (
                <Link
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
};

export default ExamplesList;
