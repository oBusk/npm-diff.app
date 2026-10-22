import type { Options } from "libnpmdiff";
import { Worker } from "node:worker_threads";
import type {
    LibnpmdiffWorkerData,
    LibnpmdiffWorkerMessage,
} from "./libnpmdiff.worker";

export class LibnpmdiffTimeoutError extends Error {
    constructor(timeoutMs: number) {
        super(`libnpmdiff did not finish within ${timeoutMs}ms`);
        this.name = "LibnpmdiffTimeoutError";
    }
}

export function runLibnpmdiff(
    specs: [string, string],
    options: Options,
    timeoutMs: number,
): Promise<string> {
    return new Promise((resolve, reject) => {
        const worker = new Worker(
            new URL("./libnpmdiff.worker.ts", import.meta.url),
            {
                workerData: { specs, options } satisfies LibnpmdiffWorkerData,
            },
        );

        const timer = setTimeout(() => {
            reject(new LibnpmdiffTimeoutError(timeoutMs));
            void worker.terminate();
        }, timeoutMs);

        worker.once("message", (message: LibnpmdiffWorkerMessage) => {
            clearTimeout(timer);
            if (message.ok) {
                resolve(message.diff);
            } else {
                reject(Object.assign(new Error(), message.error));
            }
            void worker.terminate();
        });

        worker.once("error", (e) => {
            clearTimeout(timer);
            reject(e);
        });

        worker.once("exit", (code) => {
            clearTimeout(timer);
            reject(new Error(`libnpmdiff worker exited with code ${code}`));
        });
    });
}
