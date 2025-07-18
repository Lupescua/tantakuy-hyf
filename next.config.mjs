/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        // you can also scope by pathname if you like:
        // pathname: '/your-cloudinary-path/**',
      },
      {
        protocol: 'https',
        hostname: 'tantakuy-hyf-2025.s3.eu-north-1.amazonaws.com',
        // if you want, you can match only under /entries/:
        // pathname: '/entries/**',
      },
    ],
  },
};

export default nextConfig;
