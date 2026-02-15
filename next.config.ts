import type { NextConfig } from "next";
import nextra from 'nextra';

const nextConfig: NextConfig = {
    reactStrictMode: false,
    cacheComponents: true,
    turbopack: {
        resolveAlias: {
            // Path to your `mdx-components` file with extension
            'next-mdx-import-source-file': './src/mdx-components.tsx'
        }
    }
}

const withNextra = nextra({
    readingTime: true,
});


export default withNextra(nextConfig);
