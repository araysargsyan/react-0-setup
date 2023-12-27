import {
    createElement,
    type JSX,
    type PropsWithChildren,
} from 'react';


type TDynamicComponentProps<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T] & {
    TagName: T;
};

function DynamicComponent<T extends keyof JSX.IntrinsicElements>({
    TagName,
    children,
    ...otherProps
}: PropsWithChildren<TDynamicComponentProps<T>>) {
    return createElement(TagName, otherProps, children);
}

export default DynamicComponent;
