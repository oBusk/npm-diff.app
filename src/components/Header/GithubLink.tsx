import { Box, PseudoBox, PseudoBoxProps } from "@chakra-ui/core";
import { AnchorHTMLAttributes } from "react";
import { DiGithubBadge } from "react-icons/di";

export type Props = PseudoBoxProps & AnchorHTMLAttributes<Element>;

export const GithubLink: React.FC<Props> = (props) => (
    <PseudoBox
        as="a"
        href="https://github.com/oBusk/package-diff"
        rel="noopener noreferrer"
        target="_blank"
        aria-label="Go to package-diff's Github Repo"
        outline="0"
        transition="all 0.2s"
        borderRadius="md"
        _focus={{
            boxShadow: "outline",
        }}
        {...props}
    >
        <Box as={DiGithubBadge} size="8" color="current" />
    </PseudoBox>
);
