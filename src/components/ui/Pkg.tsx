import { type ElementRef, forwardRef } from "react";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import { simplePackageSpecToString } from "^/lib/SimplePackageSpec";
import Code, { type CodeProps } from "./Code";

export interface PkgProps extends CodeProps {
    pkg: SimplePackageSpec;
}

const Pkg = forwardRef<ElementRef<typeof Code>, PkgProps>(
    ({ pkg, ...props }: PkgProps, ref) => (
        <Code {...props} ref={ref}>
            {simplePackageSpecToString(pkg)}
        </Code>
    ),
);
Pkg.displayName = "Pkg";

export default Pkg;
