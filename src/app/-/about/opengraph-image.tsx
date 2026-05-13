import {
    contentType,
    OpenGraphImage,
    size,
} from "^/app/_components/OpenGraphImage";

export const alt = "About – npm-diff.app";
export { size, contentType };

export default async function Image() {
    return OpenGraphImage({
        tag: "About",
        title: "npm-diff.app",
        icon: (
            <svg
                width="300"
                height="300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(59, 130, 246, 0.8)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                    position: "absolute",
                    right: 80,
                    top: "50%",
                    transform: "translateY(-50%)",
                }}
            >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
            </svg>
        ),
    });
}
