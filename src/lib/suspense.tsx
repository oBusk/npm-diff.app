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
    const C = ({ key, ...props }: T & { key: string }): ReactElement => (
        <SuspenseComp
            key={key}
            fallback={
                typeof fallback === "function"
                    ? fallback(props as any)
                    : fallback
            }
        >
            <WrappedComponent {...(props as any)} />
        </SuspenseComp>
    );

    C.displayName = `suspense(${
        WrappedComponent.displayName ?? WrappedComponent.name
    })`;

    return C;
}
