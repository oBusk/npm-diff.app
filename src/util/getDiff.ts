import { diffLines } from "diff";
import { formatLines } from "unidiff";

export function getDiff(
    filesA: { [k: string]: string },
    filesB: { [k: string]: string },
): string {
    let diff = "";

    Object.entries(filesB).forEach(([fileName, contentB]) => {
        const contentA = filesA[fileName] || "";

        const changes = diffLines(contentA, contentB);
        const fileDiff = formatLines(changes, {
            aname: fileName,
            bname: fileName,
            context: 3,
        });

        diff += fileDiff;
    });

    return diff;
}
