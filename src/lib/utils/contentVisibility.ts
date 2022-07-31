/**
 * Returns css styles to help optimize rendering using
 * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility content-visibility},
 * and
 * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/contain}
 * for browsers that doesn't support `content-visibility`.
 *
 * Also sets
 * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/contain-intrinsic-size `contain-intrinsic-width` and `contain-intrinsic-height`}
 * to make scrolling slightly better.
 *
 * - https://web.dev/content-visibility/
 *
 * Return value intended to be spread over `css` property.
 *
 * ```tsx
 * <Flex css={{ ...contentVisibility('200px') }} />
 * ```
 */
export default function contentVisibility(this: void, height = "", width = "") {
    return {
        contain: "content",
        contentVisibility: "auto",
        containIntrinsicHeight: `auto ${height}`,
        containIntrinsicWidth: `auto ${width}`,
    } as const;
}
