import { useSearchParams } from "next/navigation";
import { type ViewType } from "react-diff-view";
import { useMedia } from "react-use";
import { DIFF_TYPE_PARAM_NAME } from "^/app/[...parts]/_page/paramNames";

export default function useViewType(): ViewType {
    const searchParams = useSearchParams();

    const defaultViewType = useMedia("(min-width: 1024px)", true)
        ? "split"
        : "unified";

    const viewTypeParam = searchParams?.get(DIFF_TYPE_PARAM_NAME);

    return (
        // If specified in URL, use that
        (viewTypeParam === "split" && "split") ||
        (viewTypeParam === "unified" && "unified") ||
        // If not, use default based on screen size
        defaultViewType
    );
}
