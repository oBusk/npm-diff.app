import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-muted-foreground">
                This page could not be found.
            </p>
            <Link
                href="/"
                className="text-primary underline underline-offset-4"
            >
                Go home
            </Link>
        </div>
    );
}
