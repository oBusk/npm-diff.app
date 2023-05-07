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
        <div className="start-1/2 top-1/2 translate-x-1/2 translate-y-1/2">
            <ErrorBox>
                <h3>Something Went Wrong</h3>
                <Code className="max-w-2xl">{`${message}`}</Code>
                <Button onClick={reset}>Try Again</Button>
            </ErrorBox>
        </div>
    );
};

export default DiffError;
