const withPWAInit = require("next-pwa");

const isDev = process.env.NODE_ENV !== "production";

const withPWA = withPWAInit({
  dest: 'public',
  disable: isDev, // can be disabled currently in dev
  
  exclude: [
    // add buildExcludes here
    ({ asset, compilation }) => {
      if (
        asset.name.startsWith("server/") ||
        asset.name.match(/^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/)
      ) {
        return true;
      }
      if (isDev && !asset.name.startsWith("static/runtime/")) {
        return true;
      }
      return false;
    }
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      webpackBuildWorker: true
    },
    images: {
       domains: ["res.cloudinary.com"]
    }
}

module.exports = withPWA(nextConfig);