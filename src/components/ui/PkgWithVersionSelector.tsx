"use client";

import { type ElementRef, forwardRef } from "react";
import VersionSelector from "^/app/[...parts]/_page/DiffIntro/VersionSelector";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import Code, { type CodeProps } from "./Code";

export interface PkgWithVersionSelectorProps extends CodeProps {
    pkg: SimplePackageSpec;
    otherPkg: SimplePackageSpec;
    side: "a" | "b";
}

const PkgWithVersionSelector = forwardRef<
    ElementRef<typeof Code>,
    PkgWithVersionSelectorProps
>(
    (
        {
            pkg,
            otherPkg,
            side,
            className,
            ...props
        }: PkgWithVersionSelectorProps,
        ref,
    ) => {
        return (
            <Code {...props} className={className} ref={ref}>
                {pkg.name}@
                <VersionSelector
                    currentSpec={pkg}
                    otherSpec={otherPkg}
                    side={side}
                    className="cursor-pointer border-none bg-transparent underline decoration-dotted outline-none hover:decoration-solid focus:decoration-solid"
                />
            </Code>
        );
    },
);
PkgWithVersionSelector.displayName = "PkgWithVersionSelector";

export default PkgWithVersionSelector;
