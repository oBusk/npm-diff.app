interface InTotoSubject {
    name: string;
    digest: {
        [algorithm: string]: string;
    };
}

/**
 * Binds the attestation to a particular subject and unambiguously identifies the types of the predicate.
 *
 * > https://github.com/in-toto/attestation/tree/v0.1.0/spec#statement
 */
export interface InTotoStatement<
    PredicateType extends string = string,
    Predicate extends Record<never, unknown> = Record<string, unknown>,
> {
    _type: "https://in-toto.io/Statement/v0.1";
    subject: Array<InTotoSubject>;

    predicateType: PredicateType;
    predicate: Predicate;
}
