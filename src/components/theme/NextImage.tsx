import { chakra, ImageProps } from "@chakra-ui/react";
import NextImage, { ImageProps as NextImageProps } from "next/image";

// Properties which are forwarded to the underlying next/image component
const FORWARDED_PROPS = [
    "width",
    "height",
    "src",
    "alt",
    "quality",
    "placeholder",
    "blurDataURL",
    "loader",
] as const;

type ForwardedProps = typeof FORWARDED_PROPS[number];

// Combine props by taking forwarded property types from next/image and rest
// from Chakra
export type ChakraNextImageProps = Pick<NextImageProps, ForwardedProps> &
    Omit<ImageProps, ForwardedProps>;

const ChakraNextImage = chakra(NextImage, {
    shouldForwardProp: (prop) =>
        (FORWARDED_PROPS as ReadonlyArray<string>).includes(prop),
});

export default ChakraNextImage;
