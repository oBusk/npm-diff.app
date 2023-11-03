import { type ElementRef, forwardRef } from "react";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import Code, { type CodeProps } from "./Code";

export interface PkgProps extends CodeProps {
    pkg: SimplePackageSpec;
}

const Pkg = forwardRef<ElementRef<typeof Code>, PkgProps>(
    ({ pkg: { name, version }, ...props }: PkgProps, ref) => (
        <Code {...props} ref={ref}>
            {name}@{version}
        </Code>
    ),
);
Pkg.displayName = "Pkg";

export default Pkg;
