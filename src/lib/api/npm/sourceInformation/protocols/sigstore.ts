import type { DsseEnvelope } from "./dsse";

/**
 * Transparency log entries
 *
 * > https://github.com/sigstore/docs/blob/7aaef6ece103e9b79ebf5fd2ab824e699beae199/content/en/about/bundle.md#transparency-log-entries
 */
interface TlogEntry<KindVersion extends string> {
    /** Global Log Index */
    logIndex: string;
    logId: {
        keyId: string;
    };
    kindVersion: {
        kind: KindVersion;
        version: "string";
    };
    /** Unix Timestamp */
    integratedTime: string;
    inclusionPromise: {
        /** Base64(SET bytes) */
        signedEntryTimestamp: string;
    };
    inclusionProof: {
        logIndex: string;
        /** Base64(HASH) */
        rootHash: string;
        treeSize: string;
        /** Base64(HASH) */
        hashes: string[];
        checkpoint: {
            /** TLOG CHECKPOINT SIGNED NOTE */
            envelope: string;
        };
    };
    /** Base64(JSON) */
    canonicalizedBody: string;
}

/**
 * Zero or more [RFC3161](https://www.ietf.org/rfc/rfc3161.txt) timestamps to validate signing
 * occurred during certificate validity.
 *
 * > https://github.com/sigstore/docs/blob/7aaef6ece103e9b79ebf5fd2ab824e699beae199/content/en/about/bundle.md#timestamp
 */
interface TimeStampVerificationData {
    rfc3161Timestamps: Array<{
        /** Base64(RFC3161 TIMESTAMP) */
        signedTimestamp: string;
    }>;
}

export interface SigStoreBundleV0_1<KindVersion extends string = string> {
    mediaType: "application/vnd.dev.sigstore.bundle+json;version=0.1";
    verificationMaterial: {
        x509CertificateChain: {
            certificates: Array<{
                rawBytes: string;
            }>;
        };
        tlogEntries: Array<TlogEntry<KindVersion>>;
        timestampVerificationData: TimeStampVerificationData | null;
    };
}

export interface SigStoreBundleV0_2<KindVersion extends string = string> {
    mediaType: "application/vnd.dev.sigstore.bundle+json;version=0.2";
    verificationMaterial: {
        publicKey: {
            hint: string;
        };
        tlogEntries: Array<TlogEntry<KindVersion>>;
        timestampVerificationData: TimeStampVerificationData;
    };
}

/**
 * A Sigstore bundle is everything required to verify a signature on an artifact.
 * This is satisfied by the Verification Material and signature Content.
 *
 * > https://docs.sigstore.dev/about/bundle/
 * > https://github.com/sigstore/docs/blob/7aaef6ece103e9b79ebf5fd2ab824e699beae199/content/en/about/bundle.md
 */
export interface SigStoreBundleV0_3<KindVersion extends string = string> {
    mediaType: "application/vnd.dev.sigstore.bundle.v0.3+json";
    /**
     * This is key material used to verify signatures along with supporting metadata like
     * transparency log entries and timestamps. When using short lived Fulcio certificates where
     * verification may occur after the certificate has expired, bundles must include at least one
     * transparency log's signed entry timestamp or an
     * [RFC3161](https://www.ietf.org/rfc/rfc3161.txt)
     * timestamp to provide proof that signing occurred during the certificates validity window.
     *
     * > https://github.com/sigstore/docs/blob/7aaef6ece103e9b79ebf5fd2ab824e699beae199/content/en/about/bundle.md#verification-material
     */
    verificationMaterial: {
        /**
         * X.509 Certificate
         *
         * A single X.509 leaf certificate conveying the signing key and containing
         * [extensions](https://github.com/sigstore/fulcio/blob/main/docs/oid-info.md)
         * for identities consumed at verification time. This is the recommended
         * `"verificationMaterial"` type for use with the public Sigstore infrastructure.
         *
         * > https://github.com/sigstore/docs/blob/7aaef6ece103e9b79ebf5fd2ab824e699beae199/content/en/about/bundle.md#x509-certificate
         */
        certificate: {
            rawBytes: string;
        };
        /**
         * Public Key Identifier
         *
         * A hint to identify an out of band delivered key to verify a signature. Like traditional
         * PKI key distribution the format of the hint must be agreed upon out of band by the signer
         * and the verifiers. The key itself is not embedded in the Sigstore bundle.
         *
         * > https://github.com/sigstore/docs/blob/7aaef6ece103e9b79ebf5fd2ab824e699beae199/content/en/about/bundle.md#public-key-identifier
         */
        publicKeyIdentifier: {
            hint: string;
        };
        /**
         * Transparency log entries
         *
         * > https://github.com/sigstore/docs/blob/7aaef6ece103e9b79ebf5fd2ab824e699beae199/content/en/about/bundle.md#transparency-log-entries
         */
        tlogEntries: Array<TlogEntry<KindVersion>>;
        /**
         * Zero or more [RFC3161](https://www.ietf.org/rfc/rfc3161.txt) timestamps to validate signing
         * occurred during certificate validity.
         *
         * > https://github.com/sigstore/docs/blob/7aaef6ece103e9b79ebf5fd2ab824e699beae199/content/en/about/bundle.md#timestamp
         */
        timestampVerificationData: TimeStampVerificationData;
    };
}

/**
 * Handles authentication and serialization.
 *
 * > https://github.com/in-toto/attestation/tree/v0.1.0/spec#envelope
 */
export interface InTotoEnvelope extends DsseEnvelope {
    payloadType: "application/vnd.in-toto+json";
}

export interface DsseBundleV0_1 extends SigStoreBundleV0_1<"intoto"> {
    dsseEnvelope: InTotoEnvelope;
}

export interface DsseBundleV0_2 extends SigStoreBundleV0_2<"intoto"> {
    dsseEnvelope: InTotoEnvelope;
}

/**
 * The DSSE envelope in a Sigstore Bundle must conform to the
 * [in-toto Envelope layer specification](https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md)
 * where `payloadType` is `"application/vnd.in-toto+json"` and the payload is an
 * [in-toto statement](https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md).
 * DSSE envelopes in a Sigstore Bundle must also contain only a single signature
 * (the DSSE spec allows multiple).
 *
 * > https://github.com/sigstore/docs/blob/7aaef6ece103e9b79ebf5fd2ab824e699beae199/content/en/about/bundle.md#dsse
 * > Example: https://github.com/sigstore/docs/blob/7aaef6ece103e9b79ebf5fd2ab824e699beae199/content/en/about/bundle.md#dsse-bundle
 */
export interface DsseBundleV0_3 extends SigStoreBundleV0_3<"dsse"> {
    dsseEnvelope: InTotoEnvelope;
}
