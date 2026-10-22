import libnpmdiff, { type Options } from "libnpmdiff";
import { parentPort, workerData } from "node:worker_threads";

export interface LibnpmdiffWorkerData {
    specs: [string, string];
    options: Options;
}

export type LibnpmdiffWorkerMessage =
    | { ok: true; diff: string }
    | {
          ok: false;
          error: {
              code?: unknown;
              type?: unknown;
              wanted?: unknown;
              pkgid?: unknown;
              message?: unknown;
          };
      };

const { specs, options } = workerData as LibnpmdiffWorkerData;

libnpmdiff(specs, options).then(
    (diff) => {
        parentPort?.postMessage({
            ok: true,
            diff,
        } satisfies LibnpmdiffWorkerMessage);
    },
    (e: unknown) => {
        const { code, type, wanted, pkgid, message } = (e ?? {}) as Record<
            string,
            unknown
        >;
        parentPort?.postMessage({
            ok: false,
            error: { code, type, wanted, pkgid, message },
        } satisfies LibnpmdiffWorkerMessage);
    },
);
