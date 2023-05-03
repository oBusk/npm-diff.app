"use client";

import { Code, forwardRef } from "@chakra-ui/react";
import SimplePackageSpec from "^/lib/SimplePackageSpec";

export interface PkgProps {
    pkg: SimplePackageSpec;
}

const Pkg = forwardRef<PkgProps, "div">(
    ({ pkg: { name, version }, ...props }: PkgProps, ref) => (
        <Code {...props} ref={ref}>
            {name}@{version}
        </Code>
    ),
);

export default Pkg;
