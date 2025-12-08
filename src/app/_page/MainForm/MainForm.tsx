"use client";

import npa from "npm-package-arg";
import {
    type FormEventHandler,
    forwardRef,
    type HTMLAttributes,
    useCallback,
    useMemo,
    useRef,
    useState,
} from "react";
import Code from "^/components/ui/Code";
import Tooltip from "^/components/ui/Tooltip";
import { type AutocompleteSuggestion } from "^/lib/autocomplete";
import { cx } from "^/lib/cva";
import CenterInputAddon from "./CenterInputAddon";
import DiffButton from "./DiffButton";
import SpecInput, { type SpecInputRef } from "./SpecInput";

export interface MainFormProps extends HTMLAttributes<HTMLFormElement> {
    overrideA: string | null;
    overrideB: string | null;
    isLoading: boolean;
    handleSubmit: (a: string | undefined, b: string | undefined) => void;
    fallbackSuggestions: AutocompleteSuggestion[];
}

const MainForm = forwardRef<HTMLFormElement, MainFormProps>(
    (
        {
            overrideA,
            overrideB,
            children,
            isLoading,
            handleSubmit,
            fallbackSuggestions,
            className,
            ...props
        },
        ref,
    ) => {
        const bRef = useRef<SpecInputRef>(null);
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

        const internalHandleSubmit = useCallback<FormEventHandler>(
            (event) => {
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
            <form
                className={cx(
                    "flex flex-col lg:flex-row",
                    "items-center justify-center",
                    className,
                )}
                onSubmit={internalHandleSubmit}
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
                        className: "lg:rounded-r-none lg:border-r-0",
                        ...(overrideA
                            ? {
                                  value: overrideA,
                                  disabled: true,
                              }
                            : undefined),
                    }}
                    fallbackSuggestions={fallbackSuggestions}
                ></SpecInput>
                <CenterInputAddon className="hidden lg:flex">
                    <span>...</span>
                </CenterInputAddon>
                <SpecInput
                    id="b"
                    ref={bRef}
                    inputValue={b}
                    onInputValueChange={setB}
                    optionalPackageFilter={bPackageFilter}
                    wrapperProps={{
                        className: "mt-2 lg:mt-0",
                    }}
                    inputProps={{
                        className: "lg:rounded-l-none lg:border-l-0",
                        ...(overrideB
                            ? {
                                  value: overrideB,
                                  disabled: true,
                              }
                            : undefined),
                    }}
                    fallbackSuggestions={fallbackSuggestions}
                ></SpecInput>
                <div className="mt-2 lg:ml-8 lg:mt-0">
                    {isLoading ? (
                        <DiffButton isLoading={true} a={a} />
                    ) : (
                        <Tooltip
                            label={
                                !a ? (
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
                                )
                            }
                        >
                            <DiffButton isLoading={false} a={a} />
                        </Tooltip>
                    )}
                </div>
            </form>
        );
    },
);
MainForm.displayName = "MainForm";

export default MainForm;
