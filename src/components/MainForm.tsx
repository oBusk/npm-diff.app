import {
    Button,
    forwardRef,
    Input,
    InputProps,
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

const SpecInput = forwardRef<InputProps, "input">((props, ref) => (
    <Input type="text" maxWidth="24em" ref={ref} {...props} />
));

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
            as="form"
            onSubmit={internalHandleSubmit}
            align="center"
            justify="center"
            direction={{ base: "column", lg: "row" }}
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
                ></SpecInput>
            </Tooltip>
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
                <Button isLoading={isLoading} type="submit" disabled={!b || !a}>
                    npm diff! 📦🔃
                </Button>
            </Tooltip>
        </Stack>
    );
};

export default MainForm;
