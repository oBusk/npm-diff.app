import type { ComponentType } from "react";

// Loading page seems to receive two objects as props:
// But I don't know what they are, so I'm just saying you're not getting any props.
export type LoadingComponent = ComponentType<void>;

export interface ErrorProps {
    error: Error;
    reset: () => void;
}

export type ErrorComponent = ComponentType<ErrorProps>;
