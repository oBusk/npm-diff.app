import { Box, Code, Flex, forwardRef, StackProps } from "@chakra-ui/react";
import { Loader2 } from "lucide-react";
import npa from "npm-package-arg";
import { FormEvent, useCallback, useMemo, useRef, useState } from "react";
import { Button } from "^/components/ui/button";
import Tooltip from "^/components/ui/Tooltip";
import { AutocompleteSuggestion } from "^/lib/autocomplete";
import CenterInputAddon from "./CenterInputAddon";
import SpecInput from "./SpecInput";

const SIZE = "md";

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
                    fallbackSuggestions={fallbackSuggestions}
                ></SpecInput>
                <Box
                    marginInlineStart={{ lg: "2rem" }}
                    marginTop={{ base: "0.5rem", lg: 0 }}
                >
                    <Tooltip
                        {...(!a
                            ? {
                                  label: "Enter a package specification to compare",
                                  background: "red.700",
                              }
                            : {
                                  label: (
                                      <>
                                          Compare <Code>{a}</Code>{" "}
                                          {!!b && (
                                              <>
                                                  and <Code>{b}</Code>
                                              </>
                                          )}{" "}
                                          now!
                                      </>
                                  ),
                              })}
                        isOpen={isLoading ? false : undefined}
                    >
                        <Box>
                            <Button
                                type="submit"
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
                    </Tooltip>
                </Box>
            </Flex>
        );
    },
);

export default MainForm;
