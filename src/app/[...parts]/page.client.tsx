"use client";

import { FunctionComponent, ReactNode } from "react";
import DiffOptions from "^/lib/DiffOptions";
import SimplePackageSpec from "^/lib/SimplePackageSpec";
import DiffIntro from "./_page/DiffIntro";

export interface DiffPageClientProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    services: ReactNode;
    options: DiffOptions;
    diffResults: ReactNode;
}

const DiffPageClient: FunctionComponent<DiffPageClientProps> = ({
    a,
    b,
    options,
    services,
    diffResults,
}) => (
    <>
        <DiffIntro
            alignSelf="stretch"
            a={a}
            b={b}
            services={services}
            options={options}
        />
        {diffResults}
    </>
);

export default DiffPageClient;
