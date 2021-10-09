import { chakra } from "@chakra-ui/react";
import {
    Decoration as _Decoration,
    Diff as _Diff,
    Hunk as _Hunk,
} from "react-diff-view";

// Simply wrap any component as `chakra()` so we can style them just like all other components

export const Diff = chakra(_Diff);

export const Decoration = chakra(_Decoration);

export const Hunk = chakra(_Hunk);
