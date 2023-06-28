"use client";

import { useEffect } from "react";
import Button from "^/components/ui/Button";
import Code from "^/components/ui/Code";
import type { ErrorComponent } from "^/next";
import ErrorBox from "./_error/ErrorBox";

const DiffError: ErrorComponent = ({ error: error, reset }) => {
    const message = error?.message ?? error ?? "Unknown error";

    useEffect(() => {
        // Log the error to an error reporting service
        console.error(message);
    }, [message]);

    return (
        <ErrorBox className="flex flex-col items-start gap-2 self-center">
            <h3>Something Went Wrong</h3>
            <Code className="max-w-2xl">{`${message}`}</Code>
            <Button onClick={reset} variant="outline">
                Try Again
            </Button>
        </ErrorBox>
    );
};

export default DiffError;
