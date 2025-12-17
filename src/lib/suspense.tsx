import {
    type ComponentType,
    type FunctionComponent,
    type ReactElement,
    type ReactNode,
    Suspense as SuspenseComp,
} from "react";

/**
 * Wrap a component in a Suspense component.
 */
export default function suspense<T>(
    WrappedComponent: ComponentType<T>,
    fallback: FunctionComponent<T> | ReactNode = <></>,
): FunctionComponent<T & { key: string }> {
    const C = async ({
        key,
        ...props
    }: T & { key: string }): Promise<ReactElement> => (
        <SuspenseComp
            key={key}
            fallback={
                typeof fallback === "function"
                    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      await fallback(props as any)
                    : fallback
            }
        >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <WrappedComponent {...(props as any)} />
        </SuspenseComp>
    );

    C.displayName = `suspense(${
        WrappedComponent.displayName ?? WrappedComponent.name
    })`;

    return C;
}
