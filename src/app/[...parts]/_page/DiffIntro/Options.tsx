import { Code, Heading, Text } from "@chakra-ui/react";
import { forwardRef } from "@chakra-ui/system";
import BorderBox from "^/components/BorderBox";
import { type NpmDiffOptions } from "^/lib/npmDiff";

interface OptionsProps {
    options: NpmDiffOptions;
}

const Options = forwardRef<OptionsProps, typeof BorderBox>(
    ({ options: { diffFiles = [], ...options } = {} }, ref) => {
        const specifiedOptions = Object.entries(options).filter(
            ([, value]) => value != null,
        );

        return (
            <BorderBox margin="10px 0" ref={ref}>
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

export default Options;
