import {
    lazy, type LazyExoticComponent, type ComponentType
} from 'react';


type LazyImportReturnType<T extends ComponentType<any>> = { default: T };
type LazyImportComponent<T extends ComponentType<any>> = () => Promise<LazyImportReturnType<T>>;

export default function lazyImport<T extends ComponentType<any>>(component: LazyImportComponent<T>): LazyExoticComponent<T> {
    const LazyComponent = lazy<T>(async () => {
        let importedComponent: LazyImportReturnType<T>;

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
