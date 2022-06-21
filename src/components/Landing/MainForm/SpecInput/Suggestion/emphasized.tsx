import { chakra } from "@chakra-ui/react";

const Em = chakra("em", {
    baseStyle: {
        fontStyle: "normal",
        textDecoration: "underline",
    },
});

const emphasized = (text = "NO_TEXT") => {
    return Array.from(
        text.matchAll(
            /(?<before>[^<]*)(?:<em>(?<em>[^<]*)<\/em>(?<after>[^<]*))?/g,
        ),
    )
        .map(({ groups: { before, em, after } = {} }, index) => [
            before,
            em && <Em key={index}>{em}</Em>,
            after,
        ])
        .flat();
};

export default emphasized;
