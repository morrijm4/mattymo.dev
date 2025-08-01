import { getPageMap } from 'nextra/page-map';
import { Item, normalizePages } from 'nextra/normalize-pages';

export async function getPosts(): Promise<Item[]> {
    const list = await getPageMap('/posts');
    const { directories } = normalizePages({
        list,
        route: '/posts',
    });

    return directories
        .filter(dir => dir.name !== 'index')
        .sort((a, b) => Number(new Date(b.frontMatter?.date)) - Number(new Date(a.frontMatter?.date)))
}
