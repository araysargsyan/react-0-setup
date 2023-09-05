import { createElement, type PropsWithChildren } from 'react';


interface IDynamicComponentProps {
    tagName: string;
}

function Index({
    tagName,
    children,
    ...otherProps
}: PropsWithChildren<IDynamicComponentProps>) {
    return createElement(tagName, otherProps, children);
}

export default Index;
