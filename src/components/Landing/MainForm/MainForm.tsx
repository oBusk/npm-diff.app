import { Button, Flex, forwardRef, StackProps } from "@chakra-ui/react";
import npa from "npm-package-arg";
import { FormEvent, useMemo } from "react";
import { useCallbackRef } from "use-callback-ref";
import { ComboboxRef } from "^/components/Landing/MainForm/SpecInput/Combobox/Combobox";
import Tooltip from "^/components/theme/Tooltip";
import TooltipCode from "^/components/theme/TooltipCode";
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
                        placeholder: automaticB || undefined,
                        borderStartRadius: { lg: 0 },
                    }}
                    marginTop={{ base: "0.5rem", lg: 0 }}
                ></SpecInput>
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
                        size={SIZE}
                        disabled={!a}
                        marginInlineStart={{ lg: "2rem" }}
                        marginTop={{ base: "0.5rem", lg: 0 }}
                    >
                        npm diff! 📦🔃
                    </Button>
                </Tooltip>
            </Flex>
        );
    },
);

export default MainForm;
