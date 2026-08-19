"use client";

import npa from "npm-package-arg";
import {
    type FormEventHandler,
    forwardRef,
    type HTMLAttributes,
    useMemo,
    useRef,
    useState,
} from "react";
import Code from "^/components/ui/Code";
import Label from "^/components/ui/Label";
import Tooltip from "^/components/ui/Tooltip";
import { type AutocompleteSuggestion } from "^/lib/autocomplete";
import { cx } from "^/lib/cva";
import CenterInputAddon from "./CenterInputAddon";
import DiffButton from "./DiffButton";
import SpecInput, { type SpecInputRef } from "./SpecInput";

const INPUT_CLASS =
    "h-11 rounded-[10px] border-line-strong bg-background px-3.5 font-mono text-sm text-foreground";

const LABEL_CLASS =
    "text-faint font-mono text-[11px] tracking-[0.1em] uppercase";

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
            } catch {
                //
            }

            return aNpa?.type === "version" &&
                aNpa?.name?.length &&
                aNpa?.rawSpec?.length >= 5
                ? `${aNpa.name}@>${aNpa?.rawSpec}`
                : undefined;
        }, [a]);

        const internalHandleSubmit: FormEventHandler = (event) => {
            event.preventDefault();

            const target = event.target as typeof event.target & {
                ["a-input"]: HTMLInputElement;
                ["b-input"]: HTMLInputElement;
            };

            handleSubmit(target["a-input"].value, target["b-input"].value);
        };

        return (
            <form
                className={cx(
                    "mx-auto flex w-full max-w-205 flex-col gap-3.5 rounded-[14px] border-line-strong bg-muted p-5",
                    className!,
                )}
                onSubmit={internalHandleSubmit}
                ref={ref}
                {...props}
            >
                <div className="grid grid-cols-1 items-end gap-2.5 lg:grid-cols-[1fr_40px_1fr]">
                    <div className="flex min-w-0 flex-col gap-1.5">
                        <Label htmlFor="a-input" className={LABEL_CLASS}>
                            From
                        </Label>
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
                            wrapperProps={{ className: "w-full max-w-none" }}
                            inputProps={{
                                className: INPUT_CLASS,
                                ...(overrideA
                                    ? {
                                          value: overrideA,
                                          disabled: true,
                                      }
                                    : undefined),
                            }}
                            fallbackSuggestions={fallbackSuggestions}
                        ></SpecInput>
                    </div>
                    <CenterInputAddon className="hidden h-11 items-center justify-center rounded-[10px] border-none bg-transparent lg:flex">
                        <span className="font-mono text-sm text-glyph">
                            ···
                        </span>
                    </CenterInputAddon>
                    <div className="flex min-w-0 flex-col gap-1.5">
                        <Label htmlFor="b-input" className={LABEL_CLASS}>
                            To
                        </Label>
                        <SpecInput
                            id="b"
                            ref={bRef}
                            inputValue={b}
                            onInputValueChange={setB}
                            optionalPackageFilter={bPackageFilter}
                            wrapperProps={{ className: "w-full max-w-none" }}
                            inputProps={{
                                className: INPUT_CLASS,
                                ...(overrideB
                                    ? {
                                          value: overrideB,
                                          disabled: true,
                                      }
                                    : undefined),
                            }}
                            fallbackSuggestions={fallbackSuggestions}
                        ></SpecInput>
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    {children}
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
