import {
    Box,
    Code,
    Flex,
    FlexProps,
    forwardRef,
    Heading,
    HStack,
    Text,
} from "@chakra-ui/react";
import type { Result as NpaResult } from "npm-package-arg";
import { ReactNode } from "react";
import type { File } from "react-diff-view";
import { ViewType } from "react-diff-view";
import B from "^/components/B";
import Span from "^/components/Span";
import DiffOptions from "^/lib/DiffOptions";
import contentVisibility from "^/lib/utils/contentVisibility";
import countChanges from "^/lib/utils/countChanges";
import Halfs from "./Halfs";
import Options from "./Options";
import SpecBox from "./SpecBox";
import ViewTypeSwitch from "./ViewTypeSwitch";

export interface DiffIntroProps extends FlexProps {
    a: NpaResult;
    b: NpaResult;
    files: File[];
    services: ReactNode;
    options: DiffOptions;
    viewType: ViewType;
}

const DiffIntro = forwardRef<DiffIntroProps, "h2">(
    (
        {
            a: { name: aName, rawSpec: aVersion },
            b: { name: bName, rawSpec: bVersion },
            files,
            services,
            options,
            viewType,
            ...props
        },
        ref,
    ) => {
        if (aName == null) {
            aName = "ERROR";
        }
        if (bName == null) {
            bName = "ERROR";
        }

        const changes = files.map((file) => countChanges(file.hunks));
        const additions = changes
            .map(({ additions }) => additions)
            .reduce((a, b) => a + b, 0);
        const deletions = changes
            .map(({ deletions }) => deletions)
            .reduce((a, b) => a + b, 0);

        return (
            <Flex
                direction="column"
                alignItems="center"
                css={{
                    label: "DiffIntro",
                    ...contentVisibility("700px"),
                }}
                {...props}
                ref={ref}
            >
                <Heading
                    as="h2"
                    size="sm"
                    width="100%"
                    textAlign="center"
                    marginBottom="1.5em"
                >
                    <Text>Comparing </Text>
                    <Halfs
                        left={
                            <SpecBox
                                packageName={aName}
                                packageVersion={aVersion}
                            />
                        }
                        center={
                            <Box>
                                {/* Center column */}
                                <Code>...</Code>
                            </Box>
                        }
                        right={
                            <SpecBox
                                packageName={bName}
                                packageVersion={bVersion}
                            />
                        }
                    />
                </Heading>
                {services}
                <Heading size="l">npm diff</Heading>
                <Options options={options} />
                {/* <Command
                    aName={aName}
                    aVersion={aVersion}
                    bName={bName}
                    bVersion={bVersion}
                    options={options}
                /> */}
                {files.length > 0 ? (
                    <HStack width="100%" justifyContent="space-between">
                        <Span>
                            Showing <B>{files.length} changed files</B> with{" "}
                            <B>{additions} additions</B> and{" "}
                            <B>{deletions} deletions</B>
                        </Span>
                        <ViewTypeSwitch currentViewType={viewType} />
                    </HStack>
                ) : (
                    <Box padding="3em" textAlign="center">
                        <Text fontSize="32">📦🔃</Text>
                        <Heading as="h3" marginBottom="1em">
                            There&apos;s nothing to compare!
                        </Heading>
                        <Text as={Code}>
                            {aName}@{aVersion}
                        </Text>{" "}
                        and{" "}
                        <Text as={Code}>
                            {bName}@{bVersion}
                        </Text>{" "}
                        are identical.
                    </Box>
                )}
            </Flex>
        );
    },
);

export default DiffIntro;
