"use client";

import { ComponentProps, forwardRef } from "react";
import { FileData } from "react-diff-view";
import { cx } from "^/lib/cva";
import SimplePackageSpec from "^/lib/SimplePackageSpec";
import useViewType from "^/lib/utils/useViewType";
import DiffFileComponent from "./DiffFile";

export interface DiffFilesProps extends ComponentProps<"section"> {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    files: FileData[];
}

const DiffFiles = forwardRef<HTMLElement, DiffFilesProps>(
    ({ a, b, files, className, ...props }, ref) => {
        const viewType = useViewType();

        return (
            <section
                className={cx("contain-content min-w-full", className)}
                {...props}
                ref={ref}
            >
                {files.map((file, index) => (
                    <DiffFileComponent
                        key={`${file.oldPath}➡${file.newPath}`}
                        index={index}
                        a={a}
                        b={b}
                        file={file}
                        viewType={viewType}
                        className="w-full"
                    />
                ))}
            </section>
        );
    },
);
DiffFiles.displayName = "DiffFiles";

export default DiffFiles;
