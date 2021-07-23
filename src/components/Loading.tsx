import { Heading } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import Hero from "./Hero";

const Loading: FunctionComponent = ({ ...props }) => {
    return (
        <Hero {...props}>
            <Heading as="h2">Loading...</Heading>
        </Hero>
    );
};

export default Loading;
