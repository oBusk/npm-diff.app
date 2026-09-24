export default class SpecNotFoundError extends Error {
    constructor(readonly spec: string) {
        super(`Could not find "${spec}"`);
        this.name = "SpecNotFoundError";
    }
}
