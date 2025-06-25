import webpack from "webpack";

import webpackConfig from "./webpack.config.js";

const compiler = webpack(webpackConfig);

compiler.run((err, stats) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log(stats.toString({ colors: true }));
});