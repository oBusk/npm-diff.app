import {
    chakra,
    forwardRef,
    InputAddon,
    InputAddonProps,
    useMultiStyleConfig,
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

// Trying to replicate what happens in
// https://github.com/chakra-ui/chakra-ui/blob/%40chakra-ui/react%401.6.5/packages/input/src/input-addon.tsx
// with some extra spice from
// https://github.com/chakra-ui/chakra-ui/blob/%40chakra-ui/react%401.6.5/packages/input/src/input-group.tsx
// Goal is to have a InputAddon that fits between two input elements without having to be wrapped in a
// InputGroup.
const CenterInputAddon = forwardRef<InputAddonProps, typeof InputAddon>(
    (props, ref) => {
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
                {...rest}
                ref={ref}
                sx={{
                    ...addonStyles,
                    ...placementStyles,
                    // This is obviously terrible but I absolutely CBA wrestling with chakra's nonsense
                    fontSize: "16px",
                    paddingInlineStart: "16px",
                    paddingInlineEnd: "16px",
                    borderRadius: "0",
                    height: "40px",
                }}
            />
        );
    },
);

export default CenterInputAddon;
