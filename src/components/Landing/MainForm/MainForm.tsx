import {
    Button,
    chakra,
    Input,
    Stack,
    StackProps,
    Tooltip,
} from "@chakra-ui/react";
import {
    FormEvent,
    FunctionComponent,
    useEffect,
    useRef,
    useState,
} from "react";
import CenterInputAddon from "./CenterInputAddon";

const SpecInput = chakra(Input, {
    baseStyle: {
        maxWidth: "20em",
    },
});

export interface MainFormProps extends StackProps {
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
    const aRef = useRef<HTMLInputElement>(null);
    const [a, setA] = useState("");
    const [b, setB] = useState("");

    useEffect(() => {
        // Focus the input on initial load (only)
        aRef.current?.focus();
    }, []);

    const internalHandleSubmit = (event: FormEvent): void => {
        event.preventDefault();

        const target = event.target as typeof event.target & {
            a: HTMLInputElement;
            b: HTMLInputElement;
        };

        handleSubmit(target.a.value, target.b.value);
    };

    return (
        <Stack
            as="form"
            onSubmit={internalHandleSubmit}
            align="center"
            justify="center"
            direction={{ base: "column", lg: "row" }}
            spacing={{ base: "0.5rem", lg: 0 }}
            {...props}
        >
            <Tooltip
                label={`The specification of the base, like "package@1.2.3"`}
                closeOnClick={false}
            >
                <SpecInput
                    name="a"
                    placeholder="package@1.2.3 or package@^1"
                    disabled={overrideA != null || isLoading}
                    value={overrideA ?? a ?? ""}
                    onChange={(event) => setA(event.target.value)}
                    ref={aRef}
                    borderEndRadius={{ lg: 0 }}
                ></SpecInput>
            </Tooltip>
            <CenterInputAddon display={{ base: "none", lg: "flex" }}>
                ...
            </CenterInputAddon>
            <Tooltip
                label={`The specification of the compare, like "package"`}
                closeOnClick={false}
            >
                <SpecInput
                    name="b"
                    placeholder="^3.0.1 or package-b@3.X"
                    disabled={overrideB != null || isLoading}
                    value={overrideB ?? b ?? ""}
                    onChange={(event) => setB(event.target.value)}
                    borderStartRadius={{ lg: 0 }}
                ></SpecInput>
            </Tooltip>
            <Tooltip
                label={
                    !a || !b
                        ? "Neither field can be emtpy"
                        : `Compare "${a}" and "${b}" now!`
                }
                background={!a || !b ? "red.700" : undefined}
                shouldWrapChildren
            >
                <Button
                    isLoading={isLoading}
                    type="submit"
                    disabled={!b || !a}
                    marginInlineStart={{ lg: "2rem" }}
                >
                    npm diff! 📦🔃
                </Button>
            </Tooltip>
        </Stack>
    );
};

export default MainForm;
