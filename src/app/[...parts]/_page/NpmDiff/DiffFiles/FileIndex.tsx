import { type FileData } from "react-diff-view";
import { cx } from "^/lib/cva";
import countChanges from "^/lib/utils/countChanges";
import Sparkline from "./Sparkline";

export interface FileIndexProps {
    files: FileData[];
    className?: string;
}

const FileIndex = ({ files, className }: FileIndexProps) => {
    const changes = files.map((file) => ({
        file,
        ...countChanges(file.hunks),
    }));
    const totalAdditions = changes.reduce(
        (sum, { additions }) => sum + additions,
        0,
    );
    const totalDeletions = changes.reduce(
        (sum, { deletions }) => sum + deletions,
        0,
    );
    const total = totalAdditions + totalDeletions || 1;
    const addPercent = (totalAdditions / total) * 100;

    return (
        <aside
            className={cx(
                "sticky top-4 h-max rounded-xl border border-line",
                className!,
            )}
        >
            <div className="rounded-t-xl border-b border-inherit bg-card p-3.5">
                <div className="flex items-baseline gap-1.5">
                    <span className="text-[22px] font-semibold">
                        {files.length}
                    </span>
                    <span className="text-sm text-muted-foreground">files</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2 font-mono text-[12.5px]">
                    <span className="text-add">+{totalAdditions}</span>
                    <span className="text-remove">−{totalDeletions}</span>
                </div>
                <div className="mt-2.5 flex h-1 w-full overflow-hidden rounded-full bg-border">
                    <div
                        className="h-full bg-add"
                        style={{ width: `${addPercent}%` }}
                    />
                    <div
                        className="h-full bg-remove"
                        style={{ width: `${100 - addPercent}%` }}
                    />
                </div>
            </div>
            <ul className="flex flex-col gap-0.5 p-2">
                {changes.map(({ file, additions, deletions }) => {
                    const path =
                        file.type === "delete" ? file.oldPath : file.newPath;

                    return (
                        <li key={path}>
                            <a
                                href={`#file-${path}`}
                                className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-[7px] hover:bg-muted"
                            >
                                <span
                                    dir="rtl"
                                    className="min-w-0 truncate font-mono text-xs text-secondary-foreground"
                                >
                                    {path}
                                </span>
                                <Sparkline
                                    additions={additions}
                                    deletions={deletions}
                                />
                            </a>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
};

export default FileIndex;
