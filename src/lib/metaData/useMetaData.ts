import { useEffect } from "react";
import defaultMetaData from "./defaultMetaData";
import { pickDescription, pickTitle } from "./metaDataUtil";

const useTitle = (title?: string, description?: string) => {
    useEffect(() => {
        const metaDescription = document.querySelector(
            "meta[name=description]",
        );

        document.title = pickTitle(title);
        metaDescription?.setAttribute("content", pickDescription(description));

        return () => {
            document.title = defaultMetaData.title;
            metaDescription?.setAttribute(
                "content",
                defaultMetaData.description,
            );
        };
    }, [title, description]);
};
export default useTitle;
