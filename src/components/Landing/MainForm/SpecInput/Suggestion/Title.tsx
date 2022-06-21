import { Heading, HeadingProps, useColorModeValue } from "@chakra-ui/react";
import { FunctionComponent, memo } from "react";
import Span from "^/components/theme/Span";
import emphasized from "./emphasized";

const Title: FunctionComponent<
    HeadingProps & { name?: string; version?: string }
> = ({ name, version, ...props }) => {
    const color = useColorModeValue("gray.800", "whiteAlpha.900");
    const fadedColor = useColorModeValue("gray.400", "whiteAlpha.400");

    return (
        <Heading
            as="h3"
            size="sm"
            fontWeight="normal"
            fontFamily="mono"
            color={version ? fadedColor : color}
            {...props}
        >
            {version ? (
                <>
                    {name}@<Span color={color}>{emphasized(version)}</Span>
                </>
            ) : (
                emphasized(name)
            )}
        </Heading>
    );
};

export default memo(Title);
