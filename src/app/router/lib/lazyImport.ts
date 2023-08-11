import { lazy, LazyExoticComponent, ComponentType } from "react";

type LazyImportReturnType = { default: ComponentType };
type LazyImportComponent = () => Promise<LazyImportReturnType>;

export default function lazyImport(component: LazyImportComponent): LazyExoticComponent<ComponentType> {
    const isDev = true;

    const LazyComponent = lazy(async () => {
        let importedComponent: LazyImportReturnType;

        if (isDev) {
            importedComponent = await new Promise((resolve) => {
                setTimeout(async () => resolve(await component()), 800);
            });
        } else {
            importedComponent = await component();
        }

        return importedComponent;
    });

    return LazyComponent;
}
