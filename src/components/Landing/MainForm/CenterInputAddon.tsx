import {
    chakra,
    forwardRef,
    InputAddonProps,
    useMultiStyleConfig,
    useStyleConfig,
} from "@chakra-ui/react";

const StyledAddon = chakra("div", {
    baseStyle: {
        flex: "0 0 auto",
        width: "auto",
        display: "flex",
        alignItems: "center",
        whiteSpace: "nowrap",
    },
});

const CenterInputAddon = forwardRef<InputAddonProps, "div">((props, ref) => {
    const { addon: addonStyles } = useMultiStyleConfig("Input", props);

    const { placement: _, ...rest } = props;
    const placementStyles = {
        // Do both what placement=left and placement=right do
        marginEnd: "-1px",
        borderEndRadius: 0,
        borderEndColor: "transparent",
        maringStart: "-1px",
        borderStartRadius: 0,
        borderStartColor: "transparent",
    } as const;

    return (
        <StyledAddon
            ref={ref}
            {...rest}
            sx={{
                ...addonStyles,
                ...placementStyles,
            }}
        />
    );
});

export default CenterInputAddon;
