import { type ResolveOptions } from 'webpack';


export default function(srcPath: string, localesPath: string): ResolveOptions {
    return {
        extensions: [ '.tsx', '.ts', '.js', '.json' ],
        preferAbsolute: true,
        modules: [
            srcPath,
            'node_modules'
        ],
        mainFiles: [ 'index' ],
        alias: { '@locales': localesPath }
    };
}
