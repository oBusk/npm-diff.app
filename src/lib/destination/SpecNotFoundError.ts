export default class SpecNotFoundError extends Error {
    constructor(spec: string) {
        super(`Could not find "${spec}"`);
        this.name = "SpecNotFoundError";
    }
}
