import type { Options } from "libnpmdiff";
import { Suspense } from "react";
import type { FileData } from "react-diff-view";
import Stack from "^/components/ui/Stack";
import { gitDiffParse } from "^/lib/gitDiff";
import npmDiff from "^/lib/npmDiff";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import countChanges from "^/lib/utils/countChanges";
import DiffFiles from "./DiffFiles";
import NoDiff from "./NoDiff";
import ViewTypeSwitch from "./ViewTypeSwitch";

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
        <>
            <Stack direction="h" className="w-full justify-between">
                <span>
                    Showing <b>{files.length} changed files</b> with{" "}
                    <b>{additions} additions</b> and{" "}
                    <b>{deletions} deletions</b>
                </span>
                {/* Wrap in suspense because components use dynamic function https://beta.nextjs.org/docs/rendering/static-and-dynamic-rendering#using-dynamic-functions */}
                <Suspense>
                    <ViewTypeSwitch />
                </Suspense>
            </Stack>
            <DiffFiles a={a} b={b} files={files} />
        </>
    );
};

export default NpmDiff;
