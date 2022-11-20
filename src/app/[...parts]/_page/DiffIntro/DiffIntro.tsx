import {
    Box,
    Code,
    Flex,
    FlexProps,
    forwardRef,
    Heading,
    Text,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import DiffOptions from "^/lib/DiffOptions";
import SimplePackageSpec from "^/lib/SimplePackageSpec";
import contentVisibility from "^/lib/utils/contentVisibility";
import Halfs from "./Halfs";
import Options from "./Options";
import SpecBox from "./SpecBox";

export interface DiffIntroProps extends FlexProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    services: ReactNode;
    options: DiffOptions;
}

const DiffIntro = forwardRef<DiffIntroProps, "h2">(
    ({ a, b, services, options, ...props }, ref) => {
        if (a.name == null) {
            a.name = "ERROR";
        }
        if (b.name == null) {
            b.name = "ERROR";
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
                        left={<SpecBox pkg={a} />}
                        center={
                            <Box>
                                {/* Center column */}
                                <Code>...</Code>
                            </Box>
                        }
                        right={<SpecBox pkg={b} />}
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
