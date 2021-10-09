import { Button, Code, Flex, StackProps, styled, Text } from "@chakra-ui/react";
import { FormEvent, FunctionComponent, useContext } from "react";
import CenterInputAddon from "./CenterInputAddon";
import Combobox, { ComboboxProps } from "^/components/Combobox/Combobox";
import getAutocompleter from "^/lib/autocomplete";
import AutocompleteSuggestion from "^/lib/autocomplete/AutocompleteSuggestion";
import { FallbackSuggestionsContext } from "^/lib/contexts/FallbackSuggestions";

const SIZE = "md";

const SuggestionTitle = styled(Code, {
    baseStyle: {
        // `npms` wraps the matching part of the package name with `<em>`.
        // The Italic looks a bit too discreet, so let's remove italic
        // and add underline instead.
        em: {
            fontStyle: "normal",
            textDecoration: "underline",
        },
    },
});

const renderItem = ({
    title,
    body,
    titleWithHighlight,
}: AutocompleteSuggestion) => (
    <>
        {titleWithHighlight ? (
            <SuggestionTitle
                dangerouslySetInnerHTML={{
                    __html: titleWithHighlight,
                }}
            ></SuggestionTitle>
        ) : (
            <SuggestionTitle>{title}</SuggestionTitle>
        )}

        {body && <Text>{body}</Text>}
    </>
);

const SpecInput = ({
    id,
    ...props
}: Omit<ComboboxProps<AutocompleteSuggestion>, "suggestionFinder">) => {
    const fallback = useContext(FallbackSuggestionsContext);

    return (
        <Combobox
            width="100%"
            maxWidth="20em"
            id={id}
            label={null}
            initialSuggestions={fallback}
            suggestionFinder={getAutocompleter(fallback)}
            itemToString={(suggestion) => suggestion?.value || ""}
            renderItem={renderItem}
            reopenOnClose={({ inputValue }) =>
                inputValue?.endsWith("@") || false
            }
            {...props}
        />
    );
};

export interface MainFormProps extends StackProps {
    comboboxFallback: AutocompleteSuggestion[];
    overrideA: string | null;
    overrideB: string | null;
    isLoading: boolean;
    handleSubmit: (a: string | undefined, b: string | undefined) => void;
}

const MainForm: FunctionComponent<MainFormProps> = ({
    overrideA,
    overrideB,
    children,
    isLoading,
    handleSubmit,
    ...props
}) => {
    // const aRef = useRef<HTMLInputElement>(null);
    // const [a, setA] = useState("");
    // const [b, setB] = useState("");

    // useEffect(() => {
    //     // Focus the input on initial load (only)
    //     aRef.current?.focus();
    // }, []);

    const internalHandleSubmit = (event: FormEvent): void => {
        event.preventDefault();

        const target = event.target as typeof event.target & {
            ["a-input"]: HTMLInputElement;
            ["b-input"]: HTMLInputElement;
        };

        handleSubmit(target["a-input"].value, target["b-input"].value);
    };

    return (
        <Flex
            as="form"
            onSubmit={internalHandleSubmit}
            align="center"
            justify="center"
            direction={{ base: "column", lg: "row" }}
            {...props}
        >
            <SpecInput
                size={SIZE}
                id="a"
                initialIsOpen={true}
                inputProps={{
                    placeholder: "package@1.2.3 or package@^1",
                    borderEndRadius: { lg: 0 },
                }}
            ></SpecInput>
            <CenterInputAddon
                size={SIZE}
                display={{ base: "none", lg: "flex" }}
            >
                ...
            </CenterInputAddon>
            <SpecInput
                size={SIZE}
                id="b"
                inputProps={{
                    placeholder: "^3.0.1 or package-b@3.X",
                    borderStartRadius: { lg: 0 },
                }}
                marginTop={{ base: "0.5rem", lg: 0 }}
            ></SpecInput>
            {/* <Tooltip
                label={
                    !a || !b
                        ? "Neither field can be emtpy"
                        : `Compare "${a}" and "${b}" now!`
                }
                background={!a || !b ? "red.700" : undefined}
                shouldWrapChildren
            > */}
            <Button
                isLoading={isLoading}
                type="submit"
                size={SIZE}
                // disabled={!b || !a}
                marginInlineStart={{ lg: "2rem" }}
                marginTop={{ base: "0.5rem", lg: 0 }}
            >
                npm diff! 📦🔃
            </Button>
            {/* </Tooltip> */}
        </Flex>
    );
};

export default MainForm;
