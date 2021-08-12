function throttle<F extends (...args: any) => void>(fn: F, wait: number): F {
    let cooldown: ReturnType<typeof setTimeout> | null;
    let queuedArgs: any[] | null;

    return function throttledFn(this: unknown, ...args: any[]) {
        function executeFn(this: unknown) {
            fn.apply(this, queuedArgs!);
            queuedArgs = null;

            cooldown = setTimeout(function cooldownCallback() {
                // Clear the cooldown
                cooldown = null;

                if (queuedArgs != null) {
                    executeFn();
                }
            }, wait);
        }

        queuedArgs = args;

        if (!cooldown) {
            executeFn();
        }
    } as F;
}

export default throttle;
