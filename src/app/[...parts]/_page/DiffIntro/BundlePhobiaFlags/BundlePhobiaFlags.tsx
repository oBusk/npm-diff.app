"use client";

import { Code, forwardRef, HStack, StackProps, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import {
    BundlephobiaResults,
    hasSideEffects,
    isTreeShakeable,
} from "^/lib/api/bundlephobia";
import SideeffectIcon from "./assets/SideeffectIcon";
import TreeshakeIcon from "./assets/TreeshakeIcon";
import Flag from "./Flag";

export interface BundlephobiaFlagsProps extends StackProps {
    data: BundlephobiaResults;
}

const BundlephobiaFlags = forwardRef<BundlephobiaFlagsProps, "div">(
    ({ data: { a, b }, ...props }, ref) => {
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

                let colorScheme: undefined | "green" | "red";
                let tooltip = (
                    <Text>
                        Both {aTag} and {bTag} are fully tree-shakeable
                    </Text>
                );
                if (!aIsTreeShakeable) {
                    // bIsTreeShakeable === true (otherwise we wouldn't be here)

                    // a was not, b is, so it's an improvement
                    colorScheme = "green";
                    tooltip = (
                        <Text>
                            {aTag} is not tree-shakeable, but {bTag} is
                        </Text>
                    );
                } else if (!bIsTreeSheakable) {
                    // aIsTreeShakeable === true (otherwise we wouldn't be here)

                    // b was not, a is, so it's a regression
                    colorScheme = "red";
                    tooltip = (
                        <Text>
                            {aTag} is tree-shakeable, but {bTag} is not
                        </Text>
                    );
                }

                return (
                    <Flag
                        icon={TreeshakeIcon}
                        label="tree-shakeable"
                        colorScheme={colorScheme}
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
                let colorScheme: undefined | "green" | "red";
                let tooltip: ReactNode;

                if (bSideEffects === false) {
                    label = "side-effect free";
                    if (aSideEffects === false) {
                        colorScheme = undefined;
                        tooltip = (
                            <>
                                Both {aTag} and {bTag} are side-effect free
                            </>
                        );
                    } else {
                        // aSideEffects = true || "some"
                        colorScheme = "green";
                        tooltip = (
                            <>
                                {aTag} has{" "}
                                {aSideEffects === "some" ? "some " : ""}
                                side-effects, {bTag} is side-effect free.
                            </>
                        );
                    }
                } else if (bSideEffects === "some") {
                    label = "some side-effects";
                    if (aSideEffects === "some") {
                        colorScheme = undefined;
                        tooltip = (
                            <>
                                Both {aTag} and {bTag} has some side-effects
                            </>
                        );
                    } else if (aSideEffects === false) {
                        colorScheme = "red";
                        tooltip = (
                            <>
                                {aTag} is side-effect free, {bTag} has some
                                side-effects
                            </>
                        );
                    } else {
                        // aSideEffects=true
                        colorScheme = "green";
                        tooltip = (
                            <>
                                {aTag} has side-effects, {bTag} only has some
                                side-effects
                            </>
                        );
                    }
                } else {
                    colorScheme = "red";

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
                        icon={SideeffectIcon}
                        label={label}
                        colorScheme={colorScheme}
                        tooltip={tooltip}
                    />
                );
            }
        };

        return (
            <HStack {...props} ref={ref}>
                {treeShakeable()}
                {sideEffectFree()}
            </HStack>
        );
    },
);

export default BundlephobiaFlags;
