/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  transpilePackages: [
    "@fullcalendar/common",
    "@fullcalendar/core",
    "@fullcalendar/react",
    "@fullcalendar/daygrid",
    "@fullcalendar/list",
    "@fullcalendar/timegrid",
  ],
  images: {
    domains: [
      "https:/retailprojects.s3.amazonaws.com/",
      "retailprojects.s3.amazonaws.com",
    ],
  },
  experimental: {
    esmExternals: false,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(
        __dirname,
        "./node_modules/apexcharts-clevision"
      ),
    };

    return config;
  },
  env: {
    // NEXT_SECRET_APP_URL: "https://qa-apis.revestretail.com/", //qa
    NEXT_SECRET_APP_URL: "https://dev-apis.revestretail.com/", //dev2 HTTPS
    // NEXT_SECRET_APP_URL: "http://3.29.244.164:31930/", //dev2
    // NEXT_SECRET_APP_URL: "https://dev-apis.revestretail.com/", //dev
    // NEXT_SECRET_APP_URL: "http://172.50.17.203:8000/", //local
    // NEXT_SECRET_APP_URL: "http://172.50.16.124:8000/", //local2
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
