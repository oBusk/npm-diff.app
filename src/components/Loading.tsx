import { Heading } from "@chakra-ui/react";
import Hero from "./Hero";

export const Loading: React.FC = ({ ...props }) => {
    return (
        <Hero {...props}>
            <Heading as="h2">Loading...</Heading>
        </Hero>
    );
};
