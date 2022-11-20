import {
    Box,
    Code,
    Flex,
    FlexProps,
    forwardRef,
    Heading,
    Text,
} from "@chakra-ui/react";
import type { Result as NpaResult } from "npm-package-arg";
import { ReactNode } from "react";
import DiffOptions from "^/lib/DiffOptions";
import contentVisibility from "^/lib/utils/contentVisibility";
import Halfs from "./Halfs";
import Options from "./Options";
import SpecBox from "./SpecBox";

export interface DiffIntroProps extends FlexProps {
    a: NpaResult;
    b: NpaResult;
    services: ReactNode;
    options: DiffOptions;
}

const DiffIntro = forwardRef<DiffIntroProps, "h2">(
    (
        {
            a: { name: aName, rawSpec: aVersion },
            b: { name: bName, rawSpec: bVersion },
            services,
            options,
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
            </Flex>
        );
    },
);

export default DiffIntro;
