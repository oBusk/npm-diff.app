import type { Options as NpmDiffLibOptions } from "libnpmdiff";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import type { FileData } from "react-diff-view";
import { gitDiffParse } from "^/lib/gitDiff";
import npmDiff from "^/lib/npmDiff";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import Options from "../DiffIntro/Options";
import DiffFiles from "./DiffFiles";
import FileIndex from "./DiffFiles/FileIndex";
import NoDiff from "./NoDiff";
import ViewTypeSwitch from "./ViewTypeSwitch";

export interface NpmDiffProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    specs: [string, string];
    options: NpmDiffLibOptions;
}

const NpmDiff = async ({ a, b, specs, options }: NpmDiffProps) => {
    "use cache";

    cacheLife("max");

    const diff = await npmDiff(specs, options);

    const files: FileData[] = gitDiffParse(diff);

    if (files.length === 0) {
        return <NoDiff a={a} b={b} />;
    }

    return (
        <div className="grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-[264px_minmax(0,1fr)]">
            <FileIndex files={files} className="hidden lg:block" />
            <div className="flex min-w-0 flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Options options={options} />
                    {/* Wrap in suspense because components use dynamic function https://beta.nextjs.org/docs/rendering/static-and-dynamic-rendering#using-dynamic-functions */}
                    <Suspense>
                        <ViewTypeSwitch />
                    </Suspense>
                </div>
                <DiffFiles a={a} b={b} files={files} />
            </div>
        </div>
    );
};

export default NpmDiff;
