import { type ElementRef, forwardRef } from "react";
import Code, { type CodeProps } from "^/components/ui/Code";
import { type NpmDiffOptions } from "^/lib/npmDiff";

export interface CommandProps extends CodeProps {
    aName: string;
    aVersion: string;
    bName: string;
    bVersion: string;
    options: NpmDiffOptions;
}

function toKebabCase(input: string): string {
    return input.replace(/([A-Z])/g, "-$1").toLowerCase();
}

const Command = forwardRef<ElementRef<typeof Code>, CommandProps>(
    (
        {
            aName,
            aVersion,
            bName,
            bVersion,
            options: { diffFiles = "", ...options },
            ...props
        },
        ref,
    ) => {
        const optionStrings = Object.entries(options)
            .filter(([_, value]) => value != null)
            .map(([key, value]) => `--${toKebabCase(key)}='${value}'`);

        if (Array.isArray(diffFiles)) {
            diffFiles = diffFiles[0];
        }

        if (diffFiles.length > 0) {
            optionStrings.unshift(diffFiles);
        }

        return (
            <Code {...props} ref={ref}>
                npm diff --diff={aName}@{aVersion} --diff={bName}@{bVersion}
                {optionStrings?.length > 0 ? ` ${optionStrings.join(" ")}` : ""}
            </Code>
        );
    },
);
Command.displayName = "Command";

export default Command;
