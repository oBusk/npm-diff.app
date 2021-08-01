import { styled } from "@chakra-ui/react";
import {
    Decoration as _Decoration,
    Diff as _Diff,
    Hunk as _Hunk,
} from "react-diff-view";

// Simply wrap any component as `styled()` so we can style them just like all other components

export const Diff = styled(_Diff);

export const Decoration = styled(_Decoration);

export const Hunk = styled(_Hunk);
