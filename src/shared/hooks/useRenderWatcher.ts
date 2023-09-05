import { useEffect, useRef } from 'react';


interface IOptions {
    prefix: string;
    color: string;
    bgColor: string;
    padding: string;
}

type TType = 'COMPONENT' | 'HOOK';

const OptionsList: Record<TType, IOptions> = {
    COMPONENT: {
        prefix: 'RENDER',
        color: '#000',
        bgColor: '#bada55',
        padding: '5px 10px',
    },
    HOOK: {
        prefix: 'INIT',
        color: '#000',
        bgColor: '#e312e0',
        padding: '5px 10px',
    }
};

const useRenderWatcher = (componentName: string, options: string | Array<unknown> | null = null, type: TType = 'COMPONENT') => {
    if (__IS_DEV__) {
        const {
            bgColor, color, padding, prefix
        } = OptionsList[type];

        const log = (renderCount?: number) => {
            console.log(
                `%c${prefix}<${type}>: ${componentName}`
                , `
                    background-color: ${bgColor}; 
                    color: ${color}; 
                    padding: ${padding}; 
                    font-weight: 600; 
                    font-family: system-ui
                `
            );
            (options !== null) && console.log(
                `%cOPTIONS: ${typeof options === 'string' ? options : options.join(' ')}`
                , `
                    background-color: #02265e;
                    color: #fff9e6;
                    padding: 5px 10px;
                    margin-left: 50px;
                    font-family: system-ui;
                `
            );
            renderCount && console.log(
                `%cRender Count: ${renderCount}`
                , `
                    background-color: #12c4e3;
                    color: #000;
                    padding: 5px 10px;
                    margin-left: 100px;
                    font-weight: 600;
                    font-family: system-ui;
                `
            );
        };

        if (type === 'COMPONENT') {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const renderCount = useRef(0);

            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
                renderCount.current = renderCount.current + 1;
                log(renderCount.current);
            });
        } else {
            log();
        }

    }
};

export const watcher = useRenderWatcher;
export default useRenderWatcher;
