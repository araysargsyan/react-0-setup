import  { type ResolveOptions } from 'webpack';
 

export default function(srcPath: string): ResolveOptions {
    return {
        extensions: [ '.tsx', '.ts', '.js' ],
        preferAbsolute: true,
        modules: [ 
            srcPath,
            'node_modules'
        ],
        mainFiles: [ 'index' ],
        alias: {}
    };
}
