import { FunctionComponent } from "react";
import ButtonExpandBox, {
    ButtonExpandBoxProps,
} from "^/components/ui/ButtonExpandBox";
import Input from "^/components/ui/Input";
import Label from "^/components/ui/Label";

export interface OptionsFormProps
    extends Omit<ButtonExpandBoxProps, "buttonContent" | "buttonLabel"> {
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
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="files">Files</Label>
            <Input
                type="text"
                id="files"
                value={files}
                onChange={(event) => filesChange(event.target.value)}
            />
            <p className="text-sm text-muted-foreground">
                Define what files of the package to check the differance of
            </p>
        </div>
    </ButtonExpandBox>
);

export default OptionsForm;
