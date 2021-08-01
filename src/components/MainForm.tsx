import {
    Button,
    Flex,
    FlexProps,
    Input,
    InputGroup,
    InputRightAddon,
    Tooltip,
    Box,
    Stack,
    StackProps,
} from "@chakra-ui/react";
import Span from "components/theme/Span";
import {
    FormEvent,
    FunctionComponent,
    useEffect,
    useRef,
    useState,
} from "react";

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
    const [a, setA] = useState(overrideA);
    const [b, setB] = useState(overrideB);

    const internalHandleSubmit = (event: FormEvent): void => {
        event.preventDefault();

        const target = event.target as typeof event.target & {
            a: HTMLInputElement;
            b: HTMLInputElement;
        };

        handleSubmit(target.a.value, target.b.value);
    };

    useEffect(() => {
        aRef.current?.focus();
    }, []);

    return (
        <Stack
            align="center"
            as="form"
            onSubmit={internalHandleSubmit}
            {...props}
        >
            <Tooltip
                label={`The specification of the base, like "package@1.2.3"`}
                closeOnClick={false}
            >
                <Input
                    type="text"
                    name="a"
                    placeholder="package@1.2.3 or package@^1"
                    disabled={overrideA != null || isLoading}
                    value={(overrideA != null && overrideA) || a || ""}
                    onChange={(event) => setA(event.target.value)}
                    ref={aRef}
                ></Input>
            </Tooltip>
            <Tooltip
                label={`The specification of the compare, like "package"`}
                closeOnClick={false}
            >
                <Input
                    type="text"
                    name="b"
                    placeholder="^3.0.1 or package-b@3.X"
                    disabled={overrideB != null || isLoading}
                    value={(overrideB != null && overrideB) || b || ""}
                    onChange={(event) => setB(event.target.value)}
                ></Input>
            </Tooltip>
            <Tooltip
                label={
                    !a || !b
                        ? "Neither field can be emtpy"
                        : `Compare "${a}" and "${b}" now!`
                }
                background={!a || !b ? "red.700" : undefined}
            >
                <Button isLoading={isLoading} type="submit" disabled={!b || !a}>
                    npm diff! 📦🔃
                </Button>
            </Tooltip>
        </Stack>
    );
};

export default MainForm;
