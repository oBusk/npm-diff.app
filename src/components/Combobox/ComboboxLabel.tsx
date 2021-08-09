import { FormLabel, FormLabelProps, forwardRef } from "@chakra-ui/react";

const ComboboxLabel = forwardRef<FormLabelProps, "label">((props, ref) => (
    <FormLabel ref={ref} {...props} />
));

export default ComboboxLabel;
