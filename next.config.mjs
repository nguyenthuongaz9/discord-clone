/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push({
            "utf-8-validate": "commonjs utf-8-validate",
            bufferrutil: 'commonjs bufferrutil'
        });
        
        // Nhớ trả về cấu hình Webpack
        return config;
    },
    images: {
        domains: ["utfs.io"]
    }
};

export default nextConfig;
