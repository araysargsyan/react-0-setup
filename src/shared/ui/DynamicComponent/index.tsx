import { createElement, type PropsWithChildren } from 'react';


interface IDynamicComponentProps {
    TagName: keyof HTMLElementTagNameMap;
}

function DynamicComponent({
    TagName,
    children,
    ...otherProps
}: PropsWithChildren<IDynamicComponentProps>) {
    return (
        <TagName { ...otherProps }>
            { children }
        </TagName>
    );
}

export default DynamicComponent;
