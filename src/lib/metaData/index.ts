import defaultMetaData from "./defaultMetaData";
import MetaData, { MetaDataProps } from "./MetaData";
import { pickDescription, pickTitle } from "./metaDataUtil";
import useMetaData from "./useMetaData";

export type { MetaDataProps };
export {
    defaultMetaData,
    pickDescription as description,
    MetaData,
    pickTitle as title,
    useMetaData,
};
