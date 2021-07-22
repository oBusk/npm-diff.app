import { Heading } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import Hero from "./Hero";

export const Loading: FunctionComponent = ({ ...props }) => {
    return (
        <Hero {...props}>
            <Heading as="h2">Loading...</Heading>
        </Hero>
    );
};
