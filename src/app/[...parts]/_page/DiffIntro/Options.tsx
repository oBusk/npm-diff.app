import { Code, Heading, Text } from "@chakra-ui/react";
import { ElementRef, forwardRef } from "react";
import BorderBox, { BorderBoxProps } from "^/components/ui/BorderBox";
import { cx } from "^/lib/cva";
import { NpmDiffOptions } from "^/lib/npmDiff";

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
                <Heading size="xs" marginBottom="1em">
                    Options
                </Heading>
                {diffFiles ? (
                    <Text>
                        <b>files:</b>{" "}
                        <Code>{diffFiles.join(" ") || "\u00A0"}</Code>
                    </Text>
                ) : null}
                {specifiedOptions.map(([key, value]) => (
                    <Text key={key}>
                        <b>{key}:</b> <Code>{JSON.stringify(value)}</Code>
                    </Text>
                ))}
            </BorderBox>
        );
    },
);
Options.displayName = "Options";

export default Options;
