"use server";

import type { Options } from "libnpmdiff";
import { Suspense } from "react";
import type { FileData } from "react-diff-view";
import { gitDiffParse } from "^/lib/gitDiff";
import npmDiff from "^/lib/npmDiff";
import SimplePackageSpec from "^/lib/SimplePackageSpec";
import countChanges from "^/lib/utils/countChanges";
import NoDiff from "./NoDiff";
import NpmDiffClient from "./NpmDiff.client";

export interface NpmDiffProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    specs: [string, string];
    options: Options;
}

const NpmDiff = async ({ a, b, specs, options }: NpmDiffProps) => {
    const diff = await npmDiff(specs, options);

    let files: FileData[] = gitDiffParse(diff);

    if (files.length === 0) {
        return <NoDiff a={a} b={b} />;
    }

    const changes = files.map((file) => countChanges(file.hunks));
    const additions = changes
        .map(({ additions }) => additions)
        .reduce((a, b) => a + b, 0);
    const deletions = changes
        .map(({ deletions }) => deletions)
        .reduce((a, b) => a + b, 0);

    return (
        // Wrap in suspense because it uses dynamic function https://beta.nextjs.org/docs/rendering/static-and-dynamic-rendering#using-dynamic-functions
        <Suspense>
            <NpmDiffClient
                a={a}
                b={b}
                files={files}
                additions={additions}
                deletions={deletions}
            />
        </Suspense>
    );
};

export default NpmDiff;
