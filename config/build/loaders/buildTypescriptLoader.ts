import ReactRefreshTypeScript from 'react-refresh-typescript';


export default function(isDev: boolean) {
    return {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: isDev
            ? [
                    {
                        loader: 'ts-loader',
                        options: {
                            getCustomTransformers: () => ({ before: [ ReactRefreshTypeScript() ] }),
                            transpileOnly: false,
                        },
                    },
                ]
            : 'ts-loader',
    };
}
