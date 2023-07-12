/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    dirs: [
      'app',
      'components',
      'hooks',
      'utils',
      'pages',
      'constants',
      'types',
      'libs',
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.worker\.js$/,
      loader: 'worker-loader',
      options: {
        publicPath: '/_next/',
      },
    });

    return config;
  },
};

module.exports = nextConfig;
