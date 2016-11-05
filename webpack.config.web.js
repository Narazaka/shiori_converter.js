const config = require("webpack-config-narazaka-ts-js").web;

config.entry.shiori_converter = "./src/lib/shiori_converter.ts";
config.output.library = "shioriConverter";

module.exports = config;
