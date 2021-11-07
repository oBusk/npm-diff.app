import {
    chakra,
    Heading,
    HeadingProps,
    HStack,
    Tag,
    TagProps,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { FunctionComponent, memo } from "react";
import Span from "^/components/theme/Span";
import { AutocompleteSuggestion } from "^/lib/autocomplete";

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

const TitleMemo = memo(Title);

const VersionTag: FunctionComponent<TagProps & { value: string }> = ({
    value,
    ...props
}) => {
    return <Tag variant="outline">{emphasized(value)}</Tag>;
};

const VersionTagMemo = memo(VersionTag);

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
    return (
        <>
            <TitleMemo name={name} version={version} />

            {body && <Text fontSize="xs">{body}</Text>}
            <HStack marginTop="4px">
                {tags.map((tag) => (
                    <VersionTagMemo key={tag} value={tag} />
                ))}
            </HStack>
        </>
    );
};

export default Suggestion;
