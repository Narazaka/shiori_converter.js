const webpackConfig = require("webpack-config-narazaka-ts-js").webTest;

module.exports = (config) =>
  config.set({
    frameworks: ["detectBrowsers", "mocha"],
    files:      [
      "test/**/*.js",
      "test/**/*.ts",
    ],
    exclude:       ["**/*.swp"],
    preprocessors: {
      "test/**/*.js": ["webpack"],
      "test/**/*.ts": ["webpack"],
    },
    webpack:          webpackConfig,
    coverageReporter: {
      reporters: [
        {type: "lcov"},
        {type: "html"},
        {type: "text"},
      ],
    },
    reporters:      ["mocha-own", "coverage"],
    detectBrowsers: {
      postDetection(availableBrowsers) {
        const result = availableBrowsers;
        if (process.env.TRAVIS) {
          const chromeIndex = availableBrowsers.indexOf("Chrome");
          if (chromeIndex >= 0) {
            result.splice(chromeIndex, 1);
            result.push("ChromeTravisCI");
          }
        }
        return result;
      },
    },
    customLaunchers: {
      ChromeTravisCI: {
        base:  "Chrome",
        flags: ["--no-sandbox"],
      },
    },
  });
