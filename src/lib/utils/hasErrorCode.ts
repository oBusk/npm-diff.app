export function hasErrorCode(e: unknown, code: string): boolean {
    return (
        typeof e === "object" && e !== null && "code" in e && e.code === code
    );
}
