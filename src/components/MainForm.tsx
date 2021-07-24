import {
    Button,
    Flex,
    FlexProps,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
} from "@chakra-ui/react";
import {
    FormEvent,
    FunctionComponent,
    useEffect,
    useRef,
    useState,
} from "react";

export interface MainFormProps extends FlexProps {
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
        <Flex
            justifyContent="center"
            alignItems="center"
            flex="1"
            direction="row"
            as="form"
            onSubmit={internalHandleSubmit}
            {...props}
        >
            <InputGroup>
                <Input
                    type="text"
                    name="a"
                    placeholder="package@1.2.3 or package@^1"
                    disabled={overrideA != null || isLoading}
                    width={250}
                    value={(overrideA != null && overrideA) || a || ""}
                    onChange={(event) => setA(event.target.value)}
                    ref={aRef}
                ></Input>
                <InputRightAddon borderRightRadius={0}>...</InputRightAddon>
            </InputGroup>
            <InputGroup>
                <InputLeftAddon display="none" />
                <Input
                    type="text"
                    name="b"
                    placeholder="^3.0.1 or package-b@3.X"
                    disabled={overrideB != null || isLoading}
                    width={260}
                    value={(overrideB != null && overrideB) || b || ""}
                    onChange={(event) => setB(event.target.value)}
                    borderLeft={0}
                ></Input>
            </InputGroup>
            <InputGroup marginLeft={8}>
                <Button
                    isLoading={isLoading}
                    width={140}
                    type="submit"
                    disabled={!b || !a}
                    title={
                        !a || !b
                            ? "Neither field can be emtpy"
                            : `Compare "${a}" and "${b}" now!`
                    }
                >
                    npm diff! 📦🔃
                </Button>
            </InputGroup>
        </Flex>
    );
};

export default MainForm;
