import { Box, Code, Flex, forwardRef, StackProps } from "@chakra-ui/react";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Loader2 } from "lucide-react";
import npa from "npm-package-arg";
import { FormEvent, useCallback, useMemo, useRef, useState } from "react";
import Button from "^/components/ui/Button";
import { TooltipRoot } from "^/components/ui/Tooltip";
import { AutocompleteSuggestion } from "^/lib/autocomplete";
import cn from "^/lib/cn";
import CenterInputAddon from "./CenterInputAddon";
import SpecInput from "./SpecInput";

export interface MainFormProps extends StackProps {
    overrideA: string | null;
    overrideB: string | null;
    isLoading: boolean;
    handleSubmit: (a: string | undefined, b: string | undefined) => void;
    fallbackSuggestions: AutocompleteSuggestion[];
}

const MainForm = forwardRef<MainFormProps, typeof Flex>(
    (
        {
            overrideA,
            overrideB,
            children,
            isLoading,
            handleSubmit,
            fallbackSuggestions,
            ...props
        },
        ref,
    ) => {
        const bRef = useRef<HTMLInputElement>(null);
        const [a, setA] = useState<string>("");
        const [b, setB] = useState<string>("");

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
                    inputProps={{
                        className: cn("lg:rounded-r-none", "lg:border-r-0"),
                        ...(overrideA
                            ? {
                                  value: overrideA,
                                  disabled: true,
                              }
                            : undefined),
                    }}
                    fallbackSuggestions={fallbackSuggestions}
                ></SpecInput>
                <CenterInputAddon display={{ base: "none", lg: "flex" }}>
                    ...
                </CenterInputAddon>
                <SpecInput
                    id="b"
                    inputRef={bRef}
                    inputValue={b}
                    onInputValueChange={setB}
                    optionalPackageFilter={bPackageFilter}
                    wrapperProps={{
                        className: cn("mt-2", "lg:mt-0"),
                    }}
                    inputProps={{
                        className: cn("lg:rounded-l-none", "lg:border-l-0"),
                        ...(overrideB
                            ? {
                                  value: overrideB,
                                  disabled: true,
                              }
                            : undefined),
                    }}
                    fallbackSuggestions={fallbackSuggestions}
                ></SpecInput>
                <Box
                    marginInlineStart={{ lg: "2rem" }}
                    marginTop={{ base: "0.5rem", lg: 0 }}
                >
                    <TooltipRoot open={isLoading ? false : undefined}>
                        <TooltipTrigger asChild>
                            <Box>
                                <Button
                                    type="submit"
                                    variant="secondary"
                                    size="default"
                                    disabled={!a || isLoading}
                                    className="relative overflow-hidden"
                                >
                                    {isLoading ? (
                                        <div className="absolute inset-0 flex items-center justify-center bg-primary">
                                            <Loader2 className="animate-spin" />
                                        </div>
                                    ) : null}
                                    npm diff! 📦🔃
                                </Button>
                            </Box>
                        </TooltipTrigger>
                        <TooltipContent>
                            {!a ? (
                                "Enter a package specification to compare"
                            ) : (
                                <>
                                    Compare <Code>{a}</Code>{" "}
                                    {!!b && (
                                        <>
                                            and <Code>{b}</Code>
                                        </>
                                    )}{" "}
                                    now!
                                </>
                            )}
                        </TooltipContent>
                    </TooltipRoot>
                </Box>
            </Flex>
        );
    },
);

export default MainForm;
