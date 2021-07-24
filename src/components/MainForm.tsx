import { Button, Flex, FlexProps, Input } from "@chakra-ui/react";
import { FormEvent, FunctionComponent } from "react";

export interface MainFormProps extends FlexProps {
    aValue: string;
    bValue: string;
    isLoading: boolean;
    handleSubmit: (a: string | undefined, b: string | undefined) => void;
}

const MainForm: FunctionComponent<MainFormProps> = ({
    aValue,
    bValue,
    children,
    isLoading,
    handleSubmit,
    ...props
}) => {
    const internalHandleSubmit = (event: FormEvent): void => {
        event.preventDefault();

        const target = event.target as typeof event.target & {
            a: HTMLInputElement;
            b: HTMLInputElement;
        };

        handleSubmit(target.a.value, target.b.value);
    };

    return (
        <Flex
            justifyContent="center"
            alignItems="center"
            flex="1"
            direction="row"
            as="form"
            onSubmit={internalHandleSubmit}
            {...props}
        >
            <Input
                type="text"
                name="a"
                placeholder="package@1.2.3, package@^1, package@2.X"
                disabled={isLoading}
                defaultValue={aValue}
            ></Input>
            <Input
                type="text"
                name="b"
                placeholder="^3.0.1, ~1.0.0, package-b@~3.0.0"
                disabled={isLoading}
                defaultValue={bValue}
            ></Input>
            <Button isLoading={isLoading} width="400px" type="submit">
                npm diff! 📦🔃
            </Button>
        </Flex>
    );
};

export default MainForm;
