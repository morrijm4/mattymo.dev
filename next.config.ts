import type { NextConfig } from "next";
import nextra from 'nextra';

const nextConfig: NextConfig = {
    reactStrictMode: false,
    experimental: {
        ppr: 'incremental',
    },
}

const withNextra = nextra({
    readingTime: true,
});


export default withNextra(nextConfig);
