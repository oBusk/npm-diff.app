import { PropsWithChildren } from "react";
import useMetaData from "./useMetaData";

export interface MetaDataProps {
    title?: string;
    description?: string;
}

const MetaData = ({
    children,
    title,
    description,
}: PropsWithChildren<MetaDataProps>) => {
    useMetaData(title, description);

    return <>{children}</>;
};

export default MetaData;
