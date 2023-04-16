"use client";

import { HStack } from "@chakra-ui/react";
import { FlagSkeleton } from "./Flag";

const BundlephobiaFlagsSkeleton = () => (
    <HStack>
        <FlagSkeleton />
        <FlagSkeleton />
    </HStack>
);

export default BundlephobiaFlagsSkeleton;
