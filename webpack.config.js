module.exports = {
    context: __dirname + '/app',
    entry:'./main.jsx',
    output: {
        path: __dirname + '/build',
        filename: '[name].bundle.js',
        chunkFilename: '[id].bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|build)/,
                include: /(app)/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: ['transform-runtime']
                }

            }
        ]
    },

    devtool: 'source-map'
};