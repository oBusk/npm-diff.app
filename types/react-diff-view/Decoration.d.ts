import { FunctionComponent } from "react";

export interface DecorationProps {
    hideGutter?: boolean;
    className?: string;
    gutterClassName?: string;
    contentClassName?: string;
}

export declare const Decoration: FunctionComponent<DecorationProps>;
