import { ElementRef, forwardRef, ReactNode } from "react";
import Code from "^/components/ui/Code";
import Stack, { StackProps } from "^/components/ui/Stack";
import {
    BundlephobiaResults,
    hasSideEffects,
    isTreeShakeable,
} from "^/lib/api/bundlephobia";
import { cx } from "^/lib/cva";
import SideeffectIcon from "./assets/SideeffectIcon";
import TreeshakeIcon from "./assets/TreeshakeIcon";
import Flag from "./Flag";

export interface BundlephobiaFlagsProps extends StackProps {
    data: BundlephobiaResults;
}

const BundlephobiaFlags = forwardRef<
    ElementRef<typeof Stack>,
    BundlephobiaFlagsProps
>(({ data: { a, b }, ...props }, ref) => {
    const aTag = (
        <Code>
            {a.name}@{a.version}
        </Code>
    );
    const bTag = (
        <Code>
            {b.name}@{b.version}
        </Code>
    );

    const treeShakeable = () => {
        const aIsTreeShakeable = isTreeShakeable(a);
        const bIsTreeSheakable = isTreeShakeable(b);
        if (aIsTreeShakeable || bIsTreeSheakable) {
            // If it was, or is treeshakeable, we want to show something.

            let color: undefined | "green" | "red";
            let tooltip = (
                <p>
                    Both {aTag} and {bTag} are fully tree-shakeable
                </p>
            );
            if (!aIsTreeShakeable) {
                // bIsTreeShakeable === true (otherwise we wouldn't be here)

                // a was not, b is, so it's an improvement
                color = "green";
                tooltip = (
                    <p>
                        {aTag} is not tree-shakeable, but {bTag} is
                    </p>
                );
            } else if (!bIsTreeSheakable) {
                // aIsTreeShakeable === true (otherwise we wouldn't be here)

                // b was not, a is, so it's a regression
                color = "red";
                tooltip = (
                    <p>
                        {aTag} is tree-shakeable, but {bTag} is not
                    </p>
                );
            }

            return (
                <Flag
                    Icon={TreeshakeIcon}
                    label="tree-shakeable"
                    color={color}
                    tooltip={tooltip}
                />
            );
        }
    };

    /**
     * Because there are three states for each package, there's a few scenarios
     * to consider:
     *
     * | a.hasSideEffects | b.hasSideEffects |        result          |
     * |------------------|------------------|------------------------|
     * | false            | false            | hidden                 |
     * | true             | true             | shown, default color   |
     * | "some"           | "some"           | shown, default color   |
     * | false            | true / "some"    | shown, green           |
     * | "some"           | true             | shown, green           |
     * | true / "some"    | false            | shown, red             |
     * | true             | "some"           | shown, red             |
     *
     */
    const sideEffectFree = () => {
        const aSideEffects = hasSideEffects(a);
        const bSideEffects = hasSideEffects(b);

        if (aSideEffects !== true || bSideEffects !== true) {
            // If either side is side-effect free, we want to show something.

            let label = "side-effect free";
            let color: undefined | "green" | "red";
            let tooltip: ReactNode;

            if (bSideEffects === false) {
                label = "side-effect free";
                if (aSideEffects === false) {
                    color = undefined;
                    tooltip = (
                        <>
                            Both {aTag} and {bTag} are side-effect free
                        </>
                    );
                } else {
                    // aSideEffects = true || "some"
                    color = "green";
                    tooltip = (
                        <>
                            {aTag} has {aSideEffects === "some" ? "some " : ""}
                            side-effects, {bTag} is side-effect free.
                        </>
                    );
                }
            } else if (bSideEffects === "some") {
                label = "some side-effects";
                if (aSideEffects === "some") {
                    color = undefined;
                    tooltip = (
                        <>
                            Both {aTag} and {bTag} has some side-effects
                        </>
                    );
                } else if (aSideEffects === false) {
                    color = "red";
                    tooltip = (
                        <>
                            {aTag} is side-effect free, {bTag} has some
                            side-effects
                        </>
                    );
                } else {
                    // aSideEffects=true
                    color = "green";
                    tooltip = (
                        <>
                            {aTag} has side-effects, {bTag} only has some
                            side-effects
                        </>
                    );
                }
            } else {
                color = "red";

                if (aSideEffects === "some") {
                    label = "some side-effects";
                }

                tooltip = (
                    <>
                        {aTag}{" "}
                        {aSideEffects === "some" ? (
                            <>has some side-effects</>
                        ) : (
                            <>is side-effect free</>
                        )}
                        , {bTag} has side-effects
                    </>
                );
            }

            return (
                <Flag
                    Icon={SideeffectIcon}
                    label={label}
                    color={color}
                    tooltip={tooltip}
                />
            );
        }
    };

    return (
        <Stack direction="h" {...props} ref={ref}>
            {treeShakeable()}
            {sideEffectFree()}
        </Stack>
    );
});
BundlephobiaFlags.displayName = "BundlephobiaFlags";

export default BundlephobiaFlags;
