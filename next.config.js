const withPlugins = require("next-compose-plugins");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
    webpack: (config, { webpack }) => {
        // modify the `config` here
        config.plugins.push(new webpack.ContextReplacementPlugin(/validatorjs[/\\]src[/\\]lang/, /en/));
        return config;
    },
};

module.exports = withPlugins([[withBundleAnalyzer]], nextConfig);
