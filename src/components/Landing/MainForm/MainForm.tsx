import { Button, Flex, forwardRef, StackProps } from "@chakra-ui/react";
import { FormEvent, useRef } from "react";
import { ComboboxRef } from "^/components/Combobox/Combobox";
import CenterInputAddon from "./CenterInputAddon";
import SpecInput from "./SpecInput";

const SIZE = "md";

export interface MainFormProps extends StackProps {
    overrideA: string | null;
    overrideB: string | null;
    isLoading: boolean;
    handleSubmit: (a: string | undefined, b: string | undefined) => void;
}

const MainForm = forwardRef<MainFormProps, typeof Flex>(
    (
        { overrideA, overrideB, children, isLoading, handleSubmit, ...props },
        ref,
    ) => {
        // const [a, setA] = useState("");
        // const [b, setB] = useState("");

        const bRef = useRef<ComboboxRef | null>(null);

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
                ref={ref}
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
                    versionSelected={(item) => {
                        bRef.current?.setValue(`${item.name}@`);
                        setTimeout(() => {
                            bRef.current?.focus();
                        });
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
                    comboboxRef={bRef}
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
    },
);

export default MainForm;
