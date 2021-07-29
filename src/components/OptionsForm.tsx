import {
    Flex,
    FlexProps,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
} from "@chakra-ui/react";
import { FunctionComponent } from "react";

export interface OptionsFormProps extends FlexProps {
    files: string;
    filesChange: (value: string) => void;
}

const OptionsForm: FunctionComponent<OptionsFormProps> = ({
    files,
    filesChange,
    ...props
}) => (
    <Flex direction="column" {...props}>
        <FormControl id="files">
            <FormLabel>Files</FormLabel>
            <Input
                type="text"
                value={files}
                onChange={(event) => filesChange(event.target.value)}
            />
            <FormHelperText>
                Define what files of the package to check the differance of
            </FormHelperText>
        </FormControl>
    </Flex>
);

export default OptionsForm;
