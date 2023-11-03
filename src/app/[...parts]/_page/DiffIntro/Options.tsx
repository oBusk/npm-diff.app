import { type ElementRef, forwardRef } from "react";
import BorderBox, { type BorderBoxProps } from "^/components/ui/BorderBox";
import Code from "^/components/ui/Code";
import Heading from "^/components/ui/Heading";
import { cx } from "^/lib/cva";
import { type NpmDiffOptions } from "^/lib/npmDiff";

interface OptionsProps extends BorderBoxProps {
    options: NpmDiffOptions;
}

const Options = forwardRef<ElementRef<typeof BorderBox>, OptionsProps>(
    (
        { options: { diffFiles = [], ...options } = {}, className, ...props },
        ref,
    ) => {
        const specifiedOptions = Object.entries(options).filter(
            ([, value]) => value != null,
        );

        return (
            <BorderBox className={cx("my-2", className)} {...props} ref={ref}>
                <Heading h={4} className="mb-4 text-sm">
                    Options
                </Heading>
                {diffFiles ? (
                    <span>
                        <b>files:</b>{" "}
                        <Code>{diffFiles.join(" ") || "\u00A0"}</Code>
                    </span>
                ) : null}
                {specifiedOptions.map(([key, value]) => (
                    <span key={key}>
                        <b>{key}:</b> <Code>{JSON.stringify(value)}</Code>
                    </span>
                ))}
            </BorderBox>
        );
    },
);
Options.displayName = "Options";

export default Options;
