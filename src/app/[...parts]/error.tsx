"use client";

import { Button, Center, Code } from "@chakra-ui/react";
import { useEffect } from "react";
import type { ErrorComponent } from "^/next";
import ErrorBox from "./_error/ErrorBox";

const DiffError: ErrorComponent = ({ error: error, reset }) => {
    const message = error?.message ?? error ?? "Unknown error";

    useEffect(() => {
        // Log the error to an error reporting service
        console.error(message);
    }, [message]);

    return (
        <Center>
            <ErrorBox>
                <h3>Something Went Wrong</h3>
                <Code maxWidth={700}>{`${message}`}</Code>
                <Button onClick={reset}>Try Again</Button>
            </ErrorBox>
        </Center>
    );
};

export default DiffError;
