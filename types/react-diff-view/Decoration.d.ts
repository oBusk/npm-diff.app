import { FunctionComponent, PropsWithChildren } from "react";

// https://github.com/otakustay/react-diff-view/blob/v2.4.7/src/Decoration/index.js#L33-L38
export interface DecorationProps {
    hideGutter?: boolean;
    className?: string;
    gutterClassName?: string;
    contentClassName?: string;
}

export declare const Decoration: FunctionComponent<
    PropsWithChildren<DecorationProps>
>;
