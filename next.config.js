/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    dirs: ['app', 'components', 'hooks', 'utils', 'pages'],
  },
};

module.exports = nextConfig;
