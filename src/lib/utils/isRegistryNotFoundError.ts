export default function isRegistryNotFoundError(error: unknown): boolean {
    if (typeof error !== "object" || error == null || !("code" in error)) {
        return false;
    }

    return error.code === "E404" || error.code === "ETARGET";
}
