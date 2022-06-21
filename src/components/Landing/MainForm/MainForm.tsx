import { Box, Button, Flex, forwardRef, StackProps } from "@chakra-ui/react";
import npa from "npm-package-arg";
import { FormEvent, useMemo } from "react";
import { useCallbackRef } from "use-callback-ref";
import { ComboboxRef } from "^/components/Landing/MainForm/SpecInput/Combobox/Combobox";
import { Tooltip, TooltipCode } from "^/components/theme";
import useForceUpdate from "^/lib/hooks/useForceUpdate";
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
        const forceUpdate = useForceUpdate();
        const aRef = useCallbackRef<ComboboxRef | null>(null, forceUpdate);
        const bRef = useCallbackRef<ComboboxRef | null>(null, forceUpdate);
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

        /**
         * A placeholder value for `B` if nothing is entered in `B`.
         *
         * This will be the package of `A` with the `latest` tag.
         */
        const bPlaceholder =
            !b && aNpa?.name ? `${aNpa.name}@latest` : undefined;

        const bPackageFilter =
            aNpa?.type === "version" &&
            aNpa?.name?.length &&
            aNpa?.rawSpec?.length >= 5
                ? `${aNpa.name}@>${aNpa?.rawSpec}`
                : undefined;

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
                    comboboxRef={aRef}
                    initialIsOpen={true}
                    inputProps={{
                        placeholder: "package@1.2.3 or package@^1",
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
                        placeholder: bPlaceholder || undefined,
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
                                    Compare <TooltipCode>{a}</TooltipCode> and{" "}
                                    <TooltipCode>
                                        {bPlaceholder || b}
                                    </TooltipCode>{" "}
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
