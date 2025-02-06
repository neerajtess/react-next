/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        { source: '/croper', destination: '/' },
        { source: '/resizer', destination: '/' },
        { source: '/rotate', destination: '/' },
        { source: '/passport', destination: '/' },
        { source: '/watermark', destination: '/' },
        { source: '/invert', destination: '/' },
        { source: '/flip', destination: '/' },
        { source: '/BlackWhite', destination: '/' },
      ];
    },
  };
  
  export default nextConfig;