import {
    Box,
    Button,
    Code,
    Flex,
    forwardRef,
    StackProps,
} from "@chakra-ui/react";
import npa from "npm-package-arg";
import { FormEvent, useCallback, useMemo, useRef, useState } from "react";
import { Tooltip } from "^/components/theme";
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
        const bRef = useRef<HTMLInputElement>(null);
        const [a, setA] = useState<string | undefined>("");
        const [b, setB] = useState<string | undefined>("");

        const bPackageFilter = useMemo(() => {
            if (!a) {
                return undefined;
            }

            let aNpa: npa.Result | undefined;

            try {
                // We don't really care if npa can't parse the input
                aNpa = npa(a);
            } catch (e) {
                //
            }

            return aNpa?.type === "version" &&
                aNpa?.name?.length &&
                aNpa?.rawSpec?.length >= 5
                ? `${aNpa.name}@>${aNpa?.rawSpec}`
                : undefined;
        }, [a]);

        const internalHandleSubmit = useCallback(
            (event: FormEvent): void => {
                event.preventDefault();

                const target = event.target as typeof event.target & {
                    ["a-input"]: HTMLInputElement;
                    ["b-input"]: HTMLInputElement;
                };

                handleSubmit(target["a-input"].value, target["b-input"].value);
            },
            [handleSubmit],
        );

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
                    id="a"
                    inputValue={a}
                    onInputValueChange={setA}
                    initialIsOpen={true}
                    versionSelected={(item) => {
                        const bCombobox = bRef.current;
                        if (bCombobox) {
                            setB(`${item.name}@`);
                            setTimeout(() => bCombobox.focus());
                        }
                    }}
                    size={SIZE}
                    inputProps={{
                        borderEndRadius: { lg: 0 },
                        borderEndWidth: { lg: 0 },
                        ...(overrideA
                            ? {
                                  value: overrideA,
                                  isDisabled: true,
                              }
                            : undefined),
                    }}
                ></SpecInput>
                <CenterInputAddon
                    size={SIZE}
                    display={{ base: "none", lg: "flex" }}
                >
                    ...
                </CenterInputAddon>
                <SpecInput
                    id="b"
                    inputRef={bRef}
                    inputValue={b}
                    onInputValueChange={setB}
                    optionalPackageFilter={bPackageFilter}
                    size={SIZE}
                    wrapperProps={{
                        marginTop: { base: "0.5rem", lg: 0 },
                    }}
                    inputProps={{
                        borderStartRadius: { lg: 0 },
                        borderStartWidth: { lg: 0 },
                        ...(overrideB
                            ? {
                                  value: overrideB,
                                  isDisabled: true,
                              }
                            : undefined),
                    }}
                ></SpecInput>
                <Box
                    marginInlineStart={{ lg: "2rem" }}
                    marginTop={{ base: "0.5rem", lg: 0 }}
                >
                    <Tooltip
                        label={
                            !a ? (
                                "Enter a package specification to compare"
                            ) : (
                                <>
                                    Compare <Code>{a}</Code>{" "}
                                    {b ? (
                                        <>
                                            and <Code>{b}</Code>
                                        </>
                                    ) : (
                                        ""
                                    )}{" "}
                                    now!
                                </>
                            )
                        }
                        background={!a ? "red.700" : undefined}
                    >
                        <Box>
                            <Button
                                isLoading={isLoading}
                                type="submit"
                                size={SIZE}
                                disabled={!a}
                            >
                                npm diff! 📦🔃
                            </Button>
                        </Box>
                    </Tooltip>
                </Box>
            </Flex>
        );
    },
);

export default MainForm;
