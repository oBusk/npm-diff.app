import Hero from "./Hero";
import { Heading } from "@chakra-ui/core";

export const Loading: React.FC<{}> = ({ ...props }) => {
    return (
        <Hero {...props}>
            <Heading as="h2">Loading...</Heading>
        </Hero>
    );
};
