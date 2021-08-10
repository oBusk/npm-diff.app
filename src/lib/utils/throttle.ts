function throttle<F extends (...args: any) => void>(
    fn: F,
    wait: number,
    leading: boolean = false,
): F {
    let timeout: ReturnType<typeof setTimeout> | null;
    let lastArgs: any[];

    return function throttledFn(this: unknown, ...args: any[]) {
        if (leading) {
            fn.apply(this, args);
            leading = false;
        } else {
            // Update lastargs on every call
            lastArgs = args;

            if (!timeout) {
                // If there is no timeout waiting, setup one
                timeout = setTimeout(() => {
                    timeout = null;
                    // Run with whatever is stored in `lastArgs`
                    fn.apply(this, lastArgs);
                }, wait);
            }
        }
    } as F;
}

export default throttle;
