import {
    Button,
    Flex,
    forwardRef,
    Input,
    InputProps,
    Stack,
    StackProps,
} from "@chakra-ui/react";
import npa from "npm-package-arg";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Tooltip from "^/components/theme/Tooltip";
import TooltipCode from "^/components/theme/TooltipCode";
import CenterInputAddon from "./CenterInputAddon";

const SpecInput = forwardRef<InputProps, "input">((props, ref) => (
    <Input type="text" maxWidth="20em" {...props} ref={ref} />
));

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
        const aRef = useRef<HTMLInputElement>(null);
        const [a, setA] = useState("");
        const [b, setB] = useState("");

        /**
         * A placeholder value for `B` if nothing is entered in `B`.
         *
         * This will be the package of `A` with the `latest` tag.
         */
        const automaticB = useMemo(() => {
            try {
                if (b) {
                    return null;
                }
                const aName = npa(a)?.name;
                if (!aName) {
                    return null;
                }
                return `${aName}@latest`;
            } catch (e) {
                return null;
            }
        }, [a, b]);

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
                ref={ref}
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
                        placeholder={automaticB || undefined}
                        disabled={overrideB != null || isLoading}
                        value={overrideB ?? b ?? ""}
                        onChange={(event) => setB(event.target.value)}
                        borderStartRadius={{ lg: 0 }}
                    ></SpecInput>
                </Tooltip>
                <Tooltip
                    label={
                        !a ? (
                            "Enter a package specification to compare"
                        ) : (
                            <>
                                Compare <TooltipCode>{a}</TooltipCode> and{" "}
                                <TooltipCode>{automaticB || b}</TooltipCode>{" "}
                                now!
                            </>
                        )
                    }
                    background={!a ? "red.700" : undefined}
                    shouldWrapChildren
                >
                    <Button
                        isLoading={isLoading}
                        type="submit"
                        disabled={!a}
                        marginInlineStart={{ lg: "2rem" }}
                    >
                        npm diff! 📦🔃
                    </Button>
                </Tooltip>
            </Stack>
        );
    },
);

export default MainForm;
