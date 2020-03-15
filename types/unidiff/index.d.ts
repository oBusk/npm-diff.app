export interface Options {
    /** file name for input a, defaults to 'a' */
    aname?: string;
    /** file name for input b, defaults to 'b' */
    bname?: string;
    /** write up to this many unmodified lines before each change */
    pre_context?: number;
    /** write up to this many unmodified lines after each change */
    post_context?: number;
    /**
     * default values for pre_context and post_context (specify both in one setting)
     * (context defaults to 3 when nothing is specified)
     */
    context?: number;
    /** format of output text.  currently only "unified" is supported */
    format?: "unified";
}

export declare const diffAsText: (
    a: string,
    b: string,
    options?: Options,
) => string;

export declare function formatLines(diff: unknown[], options?: Options): string;
