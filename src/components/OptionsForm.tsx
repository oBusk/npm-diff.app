import {
    FlexProps,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
} from "@chakra-ui/react";
import { FunctionComponent } from "react";
import ButtonExpandBox from "./theme/ButtonExpandBox";

export interface OptionsFormProps extends FlexProps {
    files: string;
    filesChange: (value: string) => void;
}

const OptionsForm: FunctionComponent<OptionsFormProps> = ({
    files,
    filesChange,
    ...props
}) => (
    <ButtonExpandBox
        buttonContent="Options"
        buttonLabel="Toggle options"
        {...props}
    >
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
    </ButtonExpandBox>
);

export default OptionsForm;
