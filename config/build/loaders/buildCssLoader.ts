import { loader as MiniCssExtractLoader } from 'mini-css-extract-plugin';


export default function(isDev: boolean, pattern: string = 's[ac]ss') {
    return  {
        test: new RegExp(`\.${pattern}$`, 'i'),
        use: [
            isDev ? 'style-loader' : MiniCssExtractLoader,
            {
                loader: 'css-loader',
                options: {
                    modules: {
                        auto: new RegExp(`\.module\.${pattern}$`, 'i'),
                        //localIdentName: isDev ? '[local]-[hash:base64:8]__[name]__[path]' : '[local]-[hash:base64:8]',
                        localIdentName: '[local]-[hash:base64:8]',
                    },
                }
            },
            'sass-loader'
        ]
    };
}
