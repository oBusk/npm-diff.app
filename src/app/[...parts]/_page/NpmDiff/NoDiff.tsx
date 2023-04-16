"use client";

import { Box, Code, Heading, Text } from "@chakra-ui/react";
import SimplePackageSpec from "^/lib/SimplePackageSpec";

export interface NoDiffProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
}

const NoDiff = ({ a, b }: NoDiffProps) => (
    <Box padding="3em" textAlign="center">
        <Text fontSize="32">📦🔃</Text>
        <Heading as="h3" marginBottom="1em">
            There&apos;s nothing to compare!
        </Heading>
        <Text as={Code}>
            {a.name}@{a.version}
        </Text>{" "}
        and{" "}
        <Text as={Code}>
            {b.name}@{b.version}
        </Text>{" "}
        are identical.
    </Box>
);

export default NoDiff;
