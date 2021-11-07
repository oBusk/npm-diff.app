import {
    chakra,
    Heading,
    HeadingProps,
    HStack,
    Tag,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import React, { FunctionComponent } from "react";
import Span from "^/components/theme/Span";
import { AutocompleteSuggestion } from "^/lib/autocomplete";

// const Title = chakra("h3", {
//     baseStyle: ({ theme }) => ({
//         fontSize: "1.2rem",
//         fontFamily: theme.fonts.mono,
//     }),
// });

const Title: FunctionComponent<{ faded?: boolean } & HeadingProps> = ({
    faded,
    ...props
}) => {
    return (
        <Heading
            as="h3"
            size="sm"
            fontWeight="normal"
            fontFamily="mono"
            {...props}
        />
    );
};

const Version = Span;

const Em = chakra("em", {
    baseStyle: {
        fontStyle: "normal",
        textDecoration: "underline",
    },
});

const emphasized = (text = "NO_TEXT") => {
    return Array.from(
        text.matchAll(
            /(?<before>[^<]*)(?:<em>(?<em>[^<]*)<\/em>(?<after>[^<]*))?/g,
        ),
    )
        .map(({ groups: { before, em, after } = {} }, index) => [
            before,
            em && <Em key={index}>{em}</Em>,
            after,
        ])
        .flat();
};

export interface SuggestionProps {
    item?: AutocompleteSuggestion;
    index?: number;
}

const Suggestion: FunctionComponent<SuggestionProps> = ({
    item: { name, body, tags = [], version } = {},
}) => {
    const color = useColorModeValue("gray.800", "whiteAlpha.900");
    const fadedColor = useColorModeValue("gray.400", "whiteAlpha.400");

    return (
        <>
            {version ? (
                <Title color={fadedColor}>
                    {name}@
                    <Version color={color}>{emphasized(version)}</Version>
                </Title>
            ) : (
                <Title color={color}>{emphasized(name)}</Title>
            )}

            {body && <Text>{body}</Text>}
            <HStack marginTop="4px">
                {tags.map((tag) => (
                    <Tag key={tag} variant="outline">
                        {emphasized(tag)}
                    </Tag>
                ))}
            </HStack>
        </>
    );
};

export default Suggestion;
