import { type HunkData } from "react-diff-view";

export interface CountedChanges {
    changes: number;
    additions: number;
    deletions: number;
    normal: number;
}

function countChanges(hunks: HunkData[]): CountedChanges {
    let changes = 0;
    let additions = 0;
    let deletions = 0;
    let normal = 0;

    for (let hunk of hunks) {
        for (let change of hunk.changes) {
            if (change.type === "insert") {
                additions++;
            } else if (change.type === "delete") {
                deletions++;
            } else {
                normal++;
            }
            changes++;
        }
    }

    return {
        changes,
        additions,
        deletions,
        normal,
    };
}

export default countChanges;
