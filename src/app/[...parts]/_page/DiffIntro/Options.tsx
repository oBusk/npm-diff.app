import { forwardRef, type HTMLAttributes } from "react";
import Code from "^/components/ui/Code";
import { cx } from "^/lib/cva";
import { type NpmDiffOptions } from "^/lib/npmDiff";

interface OptionsProps extends HTMLAttributes<HTMLParagraphElement> {
    options: NpmDiffOptions;
}

const CODE_CLASS = "bg-transparent p-0 text-[12.5px] text-inherit";

const Options = forwardRef<HTMLParagraphElement, OptionsProps>(
    (
        { options: { diffFiles = [], ...options } = {}, className, ...props },
        ref,
    ) => {
        const specifiedOptions = Object.entries(options).filter(
            ([, value]) => value != null,
        );

        return (
            <p
                className={cx("text-[13px] text-muted-foreground", className!)}
                {...props}
                ref={ref}
            >
                Diff of the published tarballs
                {diffFiles.length > 0 && (
                    <>
                        , ignoring{" "}
                        <Code className={CODE_CLASS}>
                            {diffFiles.join(" ")}
                        </Code>
                    </>
                )}
                {specifiedOptions.map(([key, value]) => (
                    <span key={key}>
                        {" "}
                        \u00B7 <b>{key}:</b>{" "}
                        <Code className={CODE_CLASS}>
                            {JSON.stringify(value)}
                        </Code>
                    </span>
                ))}
            </p>
        );
    },
);
Options.displayName = "Options";

export default Options;
