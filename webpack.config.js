const config = require("webpack-config-narazaka-ts-js").node;

config.entry.shiori_converter = "./src/lib/shiori_converter.ts";
config.output.library = "shioriConverter";

module.exports = config;
