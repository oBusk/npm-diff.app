export interface PackagephobiaSize {
    bytes: number;
    pretty: string;
    color: string;
}

// https://github.com/styfle/packagephobia/blob/fb69c0fe1d19689ec601dc581cabf2c326b1a7af/API.md#example-response-from-v2
export interface PackagephobiaResponse {
    name: string;
    version: string;
    publish: PackagephobiaSize;
    install: PackagephobiaSize;
}
