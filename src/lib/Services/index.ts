import Bundlephobia from "./Bundlephobia";
import NpmjsCom from "./npmjs.com";
import Packagephobia from "./Packagephobia";
import unpkg from "./unpkg";

export { Bundlephobia, Packagephobia, NpmjsCom, unpkg };

export const Services = Object.freeze([
    NpmjsCom,
    unpkg,
    Bundlephobia,
    Packagephobia,
]);

export type Service = typeof Services[number];
