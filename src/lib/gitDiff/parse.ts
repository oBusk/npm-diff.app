import parser, { File } from "gitdiff-parser";
import adjustDiff from "./adjust";

export default function parse(diff: string | null): File[] {
    if (diff == null) {
        throw new Error("diff is null");
    } else if (diff == "") {
        return [];
    }

    const adjustedDiff = adjustDiff(diff);

    if (adjustedDiff == null) {
        throw new Error("adjustedDiff is null");
    }

    return parser.parse(adjustedDiff);
}
