import { Flex, FlexProps, Heading, Link } from "@chakra-ui/react";
import NextLink from "components/theme/NextLink";
import EXAMPLES from "lib/examples";
import { QueryParams } from "lib/query";
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
                <NextLink
                    key={ex}
                    href={{
                        pathname: `/${ex}`,
                        query,
                    }}
                >
                    <Link
                        onMouseOver={() => onMouseOver(ex)}
                        onMouseOut={() => onMouseOut()}
                        onClick={() => onClick()}
                    >
                        {ex}
                    </Link>
                </NextLink>
            ))}
        </Flex>
    );
};

export default ExamplesList;
