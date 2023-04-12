"use client";

import { Box, Flex, Heading, Skeleton, Text, VStack } from "@chakra-ui/react";
import { Bundlephobia, Packagephobia } from "^/lib/Services";
import Halfs from "./DiffIntro/Halfs";

export interface SizeComparisonSkeletonProps {
    serviceName: "packagephobia" | "bundlephobia";
    sizeRowNames: string[];
}

/** The padding of the center column and the right/left half has to be the same to line up */
const COMMON_PADDING = "8px";

const SizeComparisonSkeleton = ({
    serviceName,
    sizeRowNames,
}: SizeComparisonSkeletonProps) => {
    const service =
        serviceName === "bundlephobia" ? Bundlephobia : Packagephobia;

    return (
        <>
            <Heading size="xs">{service.name}</Heading>
            <Halfs
                width="100%"
                left={
                    <VStack
                        padding={COMMON_PADDING}
                        justifyContent="space-evenly"
                    >
                        {sizeRowNames.map((sizeRowName) => (
                            <Skeleton
                                key={sizeRowName}
                                width="48px"
                                height="0.5rem"
                            />
                        ))}
                    </VStack>
                }
                center={
                    <Box padding={COMMON_PADDING} textAlign="center">
                        {sizeRowNames.map((sizeRowName) => (
                            <Text key={sizeRowName}>{sizeRowName}</Text>
                        ))}
                    </Box>
                }
                right={
                    <Flex flex="1 0 0px" justifyContent="flex-start">
                        <VStack
                            padding={COMMON_PADDING}
                            justifyContent="space-evenly"
                        >
                            {sizeRowNames.map((sizeRowName) => (
                                <Skeleton
                                    key={sizeRowName}
                                    width="72px"
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
