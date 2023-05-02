import NextImage, { ImageProps as NextImageProps } from "next/image";
import cn from "^/lib/cn";

export interface ImageProps extends Omit<NextImageProps, "src"> {
    darkSrc: NextImageProps["src"];
    lightSrc: NextImageProps["src"];
}

const Image = ({ darkSrc, lightSrc, className, ...props }: ImageProps) => {
    return (
        <>
            <NextImage
                src={lightSrc}
                className={cn("block dark:hidden", className)}
                {...props}
            />
            <NextImage
                src={darkSrc}
                className={cn("hidden dark:block", className)}
                {...props}
            />
        </>
    );
};

export default Image;
