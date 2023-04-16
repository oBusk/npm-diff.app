import type { ComponentType } from "react";

export interface ErrorProps {
    error: Error;
    reset: () => void;
}

export type ErrorComponent = ComponentType<ErrorProps>;
