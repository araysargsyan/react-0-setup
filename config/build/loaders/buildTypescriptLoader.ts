export default function() {
    return {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
    };
}
