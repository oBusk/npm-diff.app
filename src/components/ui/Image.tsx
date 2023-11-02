import NextImage, { type ImageProps as NextImageProps } from "next/image";
import { cx } from "^/lib/cva";

export interface ImageProps extends Omit<NextImageProps, "src"> {
    darkSrc: NextImageProps["src"];
    lightSrc: NextImageProps["src"];
}

const Image = ({ darkSrc, lightSrc, className, ...props }: ImageProps) => {
    return (
        <>
            <NextImage
                src={lightSrc}
                className={cx("block dark:hidden", className)}
                {...props}
            />
            <NextImage
                src={darkSrc}
                className={cx("hidden dark:block", className)}
                {...props}
            />
        </>
    );
};

export default Image;
