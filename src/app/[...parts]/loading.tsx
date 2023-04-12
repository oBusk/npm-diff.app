"use client";

import { Box, Center, Spinner } from "@chakra-ui/react";
import { LoadingComponent } from "^/next";

const DiffLoading: LoadingComponent = () => {
    return (
        <Center>
            <Box>
                Loading <Spinner />
            </Box>
        </Center>
    );
};

export default DiffLoading;
