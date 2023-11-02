"use client";

import { Box, Flex, Heading, Skeleton, Text, VStack } from "@chakra-ui/react";
import { type ReactNode } from "react";
import { type ServiceName, Services } from "^/lib/Services";
import Halfs from "../DiffIntro/Halfs";

export interface SkeletonSizeRow {
    name: string;
    a: number;
    b: number;
}

export interface SizeComparisonSkeletonProps {
    serviceName: ServiceName;
    sizeRows: SkeletonSizeRow[];
    flags?: ReactNode;
}

/** The padding of the center column and the right/left half has to be the same to line up */
const COMMON_PADDING = "8px";

const SizeComparisonSkeleton = ({
    serviceName,
    sizeRows,
    flags,
}: SizeComparisonSkeletonProps) => {
    const service = Services[serviceName];

    return (
        <>
            <Heading size="xs">{service.name}</Heading>
            {flags}
            <Halfs
                width="100%"
                left={
                    <VStack
                        padding={COMMON_PADDING}
                        justifyContent="space-evenly"
                    >
                        {sizeRows.map(({ name, a }) => (
                            <Skeleton
                                key={name}
                                width={a + "px"}
                                height="0.5rem"
                            />
                        ))}
                    </VStack>
                }
                center={
                    <Box padding={COMMON_PADDING} textAlign="center">
                        {sizeRows.map(({ name }) => (
                            <Text key={name}>{name}</Text>
                        ))}
                    </Box>
                }
                right={
                    <Flex flex="1 0 0px" justifyContent="flex-start">
                        <VStack
                            padding={COMMON_PADDING}
                            justifyContent="space-evenly"
                        >
                            {sizeRows.map(({ name, b }) => (
                                <Skeleton
                                    key={name}
                                    width={b + "px"}
                                    height="0.5rem"
                                />
                            ))}
                        </VStack>
                    </Flex>
                }
            ></Halfs>
        </>
    );
};

export default SizeComparisonSkeleton;
