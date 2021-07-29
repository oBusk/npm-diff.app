import { Flex, Heading } from "@chakra-ui/react";
import EXAMPLES from "lib/examples";
import Link from "next/link";
import { FunctionComponent } from "react";

export interface ExamplesListProps {
    exampleMouseOver: (a: string, b: string) => void;
    exampleMouseOut: () => void;
    exampleClicked: () => void;
}

const ExamplesList: FunctionComponent<ExamplesListProps> = ({
    exampleMouseOver,
    exampleMouseOut: onMouseOut,
    exampleClicked: onClick,
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
                <Link key={ex} href={`/${ex}`}>
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
