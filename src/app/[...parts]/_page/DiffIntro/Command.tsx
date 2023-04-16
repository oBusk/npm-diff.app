import { Code } from "@chakra-ui/react";
import { forwardRef } from "@chakra-ui/system";
import { NpmDiffOptions } from "^/lib/npmDiff";

export interface CommandProps {
    aName: string;
    aVersion: string;
    bName: string;
    bVersion: string;
    options: NpmDiffOptions;
}

function toKebabCase(input: string): string {
    return input.replace(/([A-Z])/g, "-$1").toLowerCase();
}

const Command = forwardRef<CommandProps, typeof Code>(
    (
        {
            aName,
            aVersion,
            bName,
            bVersion,
            options: { diffFiles = "", ...options },
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
            <Code ref={ref}>
                npm diff --diff={aName}@{aVersion} --diff={bName}@{bVersion}
                {optionStrings?.length > 0 ? ` ${optionStrings.join(" ")}` : ""}
            </Code>
        );
    },
);

export default Command;
