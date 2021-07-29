import { Flex, FlexProps, Heading } from "@chakra-ui/react";
import EXAMPLES from "lib/examples";
import { QueryParams } from "lib/query";
import Link from "next/link";
import { FunctionComponent } from "react";

export interface ExamplesListProps extends FlexProps {
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
        <Flex flexDirection="column" alignItems="center" {...props}>
            <Heading color="gray.300" size="md">
                Examples
            </Heading>
            {EXAMPLES.map((ex) => (
                <Link
                    key={ex}
                    href={{
                        pathname: `/${ex}`,
                        query,
                    }}
                >
                    <a
                        onMouseOver={() => onMouseOver(ex)}
                        onMouseOut={() => onMouseOut()}
                        onClick={() => onClick()}
                    >
                        {ex}
                    </a>
                </Link>
            ))}
        </Flex>
    );
};

export default ExamplesList;
