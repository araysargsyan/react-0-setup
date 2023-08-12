import { lazy, LazyExoticComponent, ComponentType } from "react";

type LazyImportReturnType = { default: ComponentType };
type LazyImportComponent = () => Promise<LazyImportReturnType>;

export default function lazyImport(component: LazyImportComponent): LazyExoticComponent<ComponentType> {
    const LazyComponent = lazy(async () => {
        let importedComponent: LazyImportReturnType;

        if (__IS_DEV__) {
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
