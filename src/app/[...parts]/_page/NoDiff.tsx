"use client";

import { Box, Code, Heading, Text } from "@chakra-ui/react";

export interface NoDiffProps {
    aName: string;
    aVersion: string;
    bName: string;
    bVersion: string;
}

const NoDiff = ({ aName, aVersion, bName, bVersion }: NoDiffProps) => (
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
);

export default NoDiff;
