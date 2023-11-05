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
): FunctionComponent<T> {
    const c = (props: T): ReactElement => (
        <SuspenseComp
            fallback={
                typeof fallback === "function" ? fallback(props) : fallback
            }
        >
            <WrappedComponent {...(props as any)} />
        </SuspenseComp>
    );

    c.displayName = `suspense(${
        WrappedComponent.displayName ?? WrappedComponent.name
    })`;

    return c;
}
