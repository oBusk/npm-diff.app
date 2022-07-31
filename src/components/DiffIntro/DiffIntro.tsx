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
import type { File } from "react-diff-view";
import { ViewType } from "react-diff-view";
import { B, Span } from "^/components/theme";
import { BundlephobiaResults } from "^/lib/api/bundlephobia";
import { PackagephobiaResults } from "^/lib/api/packagephobia";
import DiffOptions from "^/lib/DiffOptions";
import { Bundlephobia, Packagephobia } from "^/lib/Services";
import contentVisibility from "^/lib/utils/contentVisibility";
import countChanges from "^/lib/utils/countChanges";
import BundlephobiaFlags from "./BundlePhobiaFlags/BundlePhobiaFlags";
import Halfs from "./Halfs";
import Options from "./Options";
import SizeComparison from "./SizeComparison";
import SpecBox from "./SpecBox";
import ViewTypeSwitch from "./ViewTypeSwitch";

export interface DiffIntroProps extends FlexProps {
    a: NpaResult;
    b: NpaResult;
    files: File[];
    packagephobiaResults: PackagephobiaResults | null;
    bundlephobiaResults: BundlephobiaResults | null;
    options: DiffOptions;
    viewType: ViewType;
}

const DiffIntro = forwardRef<DiffIntroProps, "h2">(
    (
        {
            a: { name: aName, rawSpec: aVersion },
            b: { name: bName, rawSpec: bVersion },
            files,
            packagephobiaResults,
            bundlephobiaResults,
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
            .reduce((a, b) => a + b);
        const deletions = changes
            .map(({ deletions }) => deletions)
            .reduce((a, b) => a + b);

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
                <Heading as="h2" size="sm" width="100%" textAlign="center">
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
                {packagephobiaResults && (
                    <>
                        <Heading marginTop="8px" size="xs">
                            {Packagephobia.name}
                        </Heading>
                        <SizeComparison
                            service={Packagephobia}
                            a={{ name: aName ?? "ERROR", version: aVersion }}
                            b={{ name: bName ?? "ERROR", version: bVersion }}
                            sizeRows={[
                                {
                                    name: "Publish",
                                    a: {
                                        bytes: packagephobiaResults.a.publish
                                            .bytes,
                                        color: packagephobiaResults.a.publish
                                            .color,
                                    },
                                    b: {
                                        bytes: packagephobiaResults.b.publish
                                            .bytes,
                                        color: packagephobiaResults.b.publish
                                            .color,
                                    },
                                },
                                {
                                    name: "Install",
                                    a: {
                                        bytes: packagephobiaResults.a.install
                                            .bytes,
                                        color: packagephobiaResults.a.install
                                            .color,
                                    },
                                    b: {
                                        bytes: packagephobiaResults.b.install
                                            .bytes,
                                        color: packagephobiaResults.b.install
                                            .color,
                                    },
                                },
                            ]}
                            width="100%"
                        />
                    </>
                )}
                {bundlephobiaResults && (
                    <>
                        <Heading size="xs">{Bundlephobia.name}</Heading>
                        <BundlephobiaFlags data={bundlephobiaResults} />
                        <SizeComparison
                            service={Bundlephobia}
                            a={{ name: aName, version: aVersion }}
                            b={{ name: bName, version: bVersion }}
                            sizeRows={[
                                {
                                    name: "Size",
                                    a: {
                                        bytes: bundlephobiaResults.a.size,
                                    },
                                    b: {
                                        bytes: bundlephobiaResults.b.size,
                                    },
                                },
                                {
                                    name: "Gzip",
                                    a: {
                                        bytes: bundlephobiaResults.a.gzip,
                                    },
                                    b: {
                                        bytes: bundlephobiaResults.b.gzip,
                                    },
                                },
                                {
                                    name: "Dependencies",
                                    a: {
                                        count: bundlephobiaResults.a
                                            .dependencyCount,
                                    },
                                    b: {
                                        count: bundlephobiaResults.b
                                            .dependencyCount,
                                    },
                                },
                            ]}
                            width="100%"
                        />
                    </>
                )}
                <Heading size="l">npm diff</Heading>
                <Options options={options} />
                {/* <Command
                    aName={aName}
                    aVersion={aVersion}
                    bName={bName}
                    bVersion={bVersion}
                    options={options}
                /> */}
                <HStack width="100%" justifyContent="space-between">
                    <Span>
                        Showing <B>{files.length} changed files</B> with{" "}
                        <B>{additions} additions</B> and{" "}
                        <B>{deletions} deletions</B>
                    </Span>
                    <ViewTypeSwitch currentViewType={viewType} />
                </HStack>
            </Flex>
        );
    },
);

export default DiffIntro;
