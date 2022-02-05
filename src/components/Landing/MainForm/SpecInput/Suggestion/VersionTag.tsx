import { Tag, TagProps } from "@chakra-ui/react";
import { FunctionComponent, memo } from "react";
import emphasized from "./emphasized";

const VersionTag: FunctionComponent<TagProps & { value: string }> = ({
    value,
    ...props
}) => {
    return <Tag variant="outline">{emphasized(value)}</Tag>;
};

export default memo(VersionTag);
