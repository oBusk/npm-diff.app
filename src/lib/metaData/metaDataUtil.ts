import defaultMetaData from "./defaultMetaData";

export const pickTitle = (title?: string) =>
    [title, defaultMetaData.title]
        .map((t) => t?.trim())
        .filter(Boolean)
        .join(" • ");

export const pickDescription = (description?: string) =>
    description?.trim() || defaultMetaData.description.trim();
