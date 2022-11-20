"use client";

import { FunctionComponent, ReactNode } from "react";
import DiffOptions from "^/lib/DiffOptions";
import { MetaData } from "^/lib/metaData";
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
    <MetaData
        title={`Comparing ${a.name}@${a.version}...${b.name}@${b.version}`}
        description={`A diff between the npm packages "${a.name}@${a.version}" and "${b.name}@${b.version}"`}
    >
        <DiffIntro
            alignSelf="stretch"
            a={a}
            b={b}
            services={services}
            options={options}
        />
        {diffResults}
    </MetaData>
);

export default DiffPageClient;
