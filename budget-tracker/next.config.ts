import path from 'path';

const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname); // Set alias for '@'
    return config;
  },
};

export default nextConfig;
