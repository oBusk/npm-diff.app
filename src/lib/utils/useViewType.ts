import { useBreakpointValue } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { type ViewType } from "react-diff-view";
import { DIFF_TYPE_PARAM_NAME } from "^/app/[...parts]/_page/paramNames";

export default function useViewType(): ViewType {
    const searchParams = useSearchParams();
    // Even if the initial value and the first breakpoint value is the same,
    // the component will re-render. This means it will _always_ render twice
    // even when it shouldn't have to.
    // We work around this by memoizing the rendering of the component.
    const defaultViewType = useBreakpointValue<ViewType>(
        {
            base: "unified",
            lg: "split",
        },
        // We assume that most users are on a computer so default to "lg".
        // We could use something like https://github.com/kaimallea/isMobile
        // but that means cache should be different for desktop/mobile
        "lg",
    )!;

    const viewTypeParam = searchParams?.get(DIFF_TYPE_PARAM_NAME);

    return (
        // If specified in URL, use that
        (viewTypeParam === "split" && "split") ||
        (viewTypeParam === "unified" && "unified") ||
        // If not, use default based on screen size
        defaultViewType
    );
}
