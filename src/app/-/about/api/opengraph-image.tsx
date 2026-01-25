import {
    contentType,
    OpenGraphImage,
    size,
} from "^/app/_components/OpenGraphImage";

export const alt = "API – npm-diff.app";
export { size, contentType };

export default async function Image() {
    return OpenGraphImage({
        tag: "Documentation",
        title: "API",
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
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        ),
    });
}
