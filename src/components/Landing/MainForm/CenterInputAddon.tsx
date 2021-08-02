import { chakra, forwardRef, InputAddonProps } from "@chakra-ui/react";

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
    const { placement: _, ...rest } = props;
    const addonStyles = {
        // Just read what `useStyles().addon` returns and store it
        // Can't use `useStyles` because it only works inside a `InputGroup`
        // which messes up layout
        fontSize: "md",
        px: 4,
        h: 10,
        borderRadius: "md",
        border: "1px solid",
        borderColor: "inherit",
        bg: "gray.100",
    } as const;
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
            __css={{
                ...addonStyles,
                ...placementStyles,
            }}
        />
    );
});

export default CenterInputAddon;
