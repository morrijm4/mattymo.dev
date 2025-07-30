import type { NextConfig } from "next";
import nextra from 'nextra';

const withNextra = nextra({
    readingTime: true,
});

export default withNextra({} satisfies NextConfig);
