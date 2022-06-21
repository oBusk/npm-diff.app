import { Box, Button, Flex, forwardRef, StackProps } from "@chakra-ui/react";
import npa from "npm-package-arg";
import { FormEvent, useCallback, useMemo } from "react";
import { useUpdate } from "react-use";
import { useCallbackRef } from "use-callback-ref";
import { ComboboxRef } from "^/components/Landing/MainForm/SpecInput/Combobox/Combobox";
import { Tooltip, TooltipCode } from "^/components/theme";
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
        const update = useUpdate();
        const aRef = useCallbackRef<ComboboxRef | null>(null, update);
        const bRef = useCallbackRef<ComboboxRef | null>(null, update);
        const a = aRef?.current?.value ?? "";
        const b = bRef?.current?.value ?? "";

        const aNpa = useMemo(() => {
            try {
                // We don't really care if npa can't parse the input
                return npa(a);
            } catch (e) {
                return undefined;
            }
        }, [a]);

        const bPackageFilter =
            aNpa?.type === "version" &&
            aNpa?.name?.length &&
            aNpa?.rawSpec?.length >= 5
                ? `${aNpa.name}@>${aNpa?.rawSpec}`
                : undefined;

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
                    size={SIZE}
                    id="a"
                    comboboxRef={aRef}
                    initialIsOpen={true}
                    inputProps={{
                        borderEndRadius: { lg: 0 },
                        ...(overrideA
                            ? {
                                  value: overrideA,
                                  isDisabled: true,
                              }
                            : undefined),
                    }}
                    versionSelected={(item) => {
                        // Wait for bPackageFilter to be set
                        setTimeout(() => {
                            bRef.current?.setValue(`${item.name}@`);
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
                        borderStartRadius: { lg: 0 },
                        ...(overrideB
                            ? {
                                  value: overrideB,
                                  isDisabled: true,
                              }
                            : undefined),
                    }}
                    marginTop={{ base: "0.5rem", lg: 0 }}
                    optionalPackageFilter={bPackageFilter}
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
                                    Compare <TooltipCode>{a}</TooltipCode>{" "}
                                    {b ? (
                                        <>
                                            and <TooltipCode>{b}</TooltipCode>
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
