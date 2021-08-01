import { createIcon } from "@chakra-ui/react";

// https://github.com/pastelsky/bundlephobia/blob/b4075b/client/assets/side-effect.svg
const SideeffectIcon = createIcon({
    displayName: "SideEffectIcon",
    viewBox: "0 0 20 20",
    path: (
        <>
            <path
                d="M9.65 6.54a3.12 3.12 0 1 0 .01 6.24 3.12 3.12 0 0 0 0-6.24zm0 .7a2.42 2.42 0 1 1 0 4.84 2.42 2.42 0 1 1 0-4.85z"
                stroke="#C8CDD3"
            />
            <path
                d="M6.2 6.54a.38.38 0 0 0 .34-.38v-3.2a.38.38 0 1 0-.75 0v2.29L1.65 1.1a.38.38 0 0 0-.54.53L5.26 5.8H2.98a.38.38 0 1 0 0 .75H6.2zM17.06 6.54a.38.38 0 1 0-.04-.75h-2.28l4.15-4.15a.38.38 0 1 0-.54-.53l-4.14 4.14V2.97a.38.38 0 1 0-.75 0v3.2c0 .2.17.37.38.37h3.22zM1.4 19c.1 0 .19-.05.26-.12l4.13-4.14v2.29a.38.38 0 1 0 .75 0v-3.2c0-.2-.17-.37-.38-.37H2.98a.38.38 0 1 0 0 .75h2.28l-4.14 4.14a.38.38 0 0 0 .28.65zM18.65 19a.38.38 0 0 0 .23-.65l-4.14-4.14h2.28a.38.38 0 1 0 0-.75h-3.18c-.21 0-.38.17-.38.38v3.19a.38.38 0 1 0 .75 0v-2.29l4.13 4.14c.08.09.2.13.31.12z"
                stroke="#90DD97"
                strokeWidth=".5"
            />
        </>
    ),
});

export default SideeffectIcon;