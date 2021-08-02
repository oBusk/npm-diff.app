import {
    Box,
    Code,
    Flex,
    FlexProps,
    forwardRef,
    Heading,
    Text,
} from "@chakra-ui/react";
import B from "components/theme/B";
import BorderBox from "components/theme/BorderBox";
import { BundlephobiaResults } from "lib/bundlephobia";
import { PackagephobiaResults } from "lib/packagephobia";
import { serviceLinks } from "lib/serviceLinks";
import npa from "npm-package-arg";
import { FunctionComponent } from "react";
import BundlephobiaFlags from "./BundlePhobiaFlags";
import ServiceLinks from "./ServiceLinks";
import SizeComparison from "./SizeComparison";

const SpecBox: FunctionComponent<{
    packageName: string;
    packageVersion: string;
}> = ({ packageName, packageVersion }) => (
    <Box>
        <Code>
            {packageName}@{packageVersion}
        </Code>
        <Text>
            <ServiceLinks
                packageName={packageName}
                packageVersion={packageVersion}
            />
        </Text>
    </Box>
);

export interface DiffIntroProps extends FlexProps {
    a: string;
    b: string;
    changedFiles: number;
    additions: number;
    deletions: number;
    packagephobiaResults: PackagephobiaResults | null;
    bundlephobiaResults: BundlephobiaResults | null;
}

const DiffIntro = forwardRef<DiffIntroProps, "h2">(
    (
        {
            a,
            b,
            changedFiles,
            additions,
            deletions,
            packagephobiaResults,
            bundlephobiaResults,
            ...props
        },
        ref,
    ) => {
        let { name: aName, rawSpec: aVersion } = npa(a);
        let { name: bName, rawSpec: bVersion } = npa(b);

        if (aName == null) {
            aName = "ERROR";
        }
        if (bName == null) {
            bName = "ERROR";
        }

        return (
            <Flex direction="column" alignItems="center" ref={ref} {...props}>
                <Heading as="h2" size="sm" width="100%" textAlign="center">
                    <Text>Comparing </Text>
                    <Flex>
                        <Flex flex="1 0 0px" justifyContent="flex-end">
                            {/* Left half */}
                            <SpecBox
                                packageName={aName}
                                packageVersion={aVersion}
                            />
                        </Flex>
                        <Box>
                            {/* Center column */}
                            <Code>...</Code>
                        </Box>
                        <Flex flex="1 0 0px" justifyContent="flex-start">
                            {/* Right half */}
                            <SpecBox
                                packageName={bName}
                                packageVersion={bVersion}
                            />
                        </Flex>
                    </Flex>
                </Heading>
                {packagephobiaResults && (
                    <>
                        <Heading marginTop="8px" size="xs">
                            Packagephobia
                        </Heading>
                        <SizeComparison
                            serviceName="Packagephobia"
                            serviceLink={serviceLinks.Packagephobia}
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
                        <Heading size="xs">Bundlephobia</Heading>
                        <BundlephobiaFlags data={bundlephobiaResults} />
                        <SizeComparison
                            serviceName="Bundlephobia"
                            serviceLink={serviceLinks.Bundlephobia}
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
                <BorderBox textAlign="center" margin="10px 0">
                    Showing {changedFiles} files with{" "}
                    <B>{additions} additions</B> and{" "}
                    <B>{deletions} deletions</B>
                </BorderBox>
            </Flex>
        );
    },
);

export default DiffIntro;
