import { Heading, HeadingProps } from "@chakra-ui/react";
import { FunctionComponent, memo } from "react";
import Span from "^/components/theme/Span";
import emphasized from "./emphasized";

const Title: FunctionComponent<
    HeadingProps & { name?: string; version?: string }
> = ({ name, version, ...props }) => {
    const color = {
        color: "gray.800",
        _dark: {
            color: "whiteAlpha.900",
        },
    } as const;
    const fadedColor = {
        color: "gray.400",
        _dark: { color: "whiteAlpha.400" },
    } as const;

    return (
        <Heading
            as="h3"
            size="sm"
            fontWeight="normal"
            fontFamily="mono"
            {...(version ? fadedColor : color)}
            {...props}
        >
            {version ? (
                <>
                    {name}@<Span {...color}>{emphasized(version)}</Span>
                </>
            ) : (
                emphasized(name)
            )}
        </Heading>
    );
};

export default memo(Title);
