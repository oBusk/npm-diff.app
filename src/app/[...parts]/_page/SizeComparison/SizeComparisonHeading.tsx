import { type ElementRef, forwardRef } from "react";
import Heading, { type HeadingProps } from "^/components/ui/Heading";
import { cx } from "^/lib/cva";

export interface SizeComparisonHeadingProps extends HeadingProps {}

const SizeComparisonHeading = forwardRef<
    ElementRef<typeof Heading>,
    SizeComparisonHeadingProps
>(({ className, ...props }, ref) => (
    <Heading h={3} className={cx("text-xs", className)} {...props} ref={ref} />
));
SizeComparisonHeading.displayName = "SizeComparisonHeading";

export default SizeComparisonHeading;
