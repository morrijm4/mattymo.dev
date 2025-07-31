import { useMDXComponents as getMDXComponents } from 'nextra-theme-blog';
import type { MDXComponents } from 'nextra/mdx-components';

const themeComponents = getMDXComponents({
    DateFormatter: ({ date }) => date.toLocaleDateString('en', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }),
});

export function useMDXComponents(components: MDXComponents) {
    return {
        ...themeComponents,
        ...components,
    }
}
