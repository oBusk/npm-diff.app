export interface DsseSignature {
    keyid: string;
    sig: string;
}

/**
 * DSSE: Dead Simple Signing Envelope
 *
 * > https://github.com/secure-systems-lab/dsse/blob/v1.0.2/envelope.md#standard-json-envelope
 */
export interface DsseEnvelope {
    payloadType: string;
    /**
     * Base64 encoded serialized body
     */
    payload: string;
    signatures: Array<DsseSignature>;
}

export function parseDsseEnvelope<R = unknown>(envelope: DsseEnvelope): R {
    const payloadJson = Buffer.from(envelope.payload, "base64").toString(
        "utf-8",
    );
    return JSON.parse(payloadJson);
}
