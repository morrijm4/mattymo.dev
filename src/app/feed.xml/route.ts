import { getPosts } from "../posts/get-posts";

const URL = 'https://mattymo.dev';

export async function GET() {
    const posts = await getPosts();

    const feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
    <channel>
        <title>mattymo.dev</title>
        <link>${URL}</link>
        <description>Latest blog posts from mattymo.dev</description>
        <language>en-us</language>
        <managingEditor>j.matthew.morrison1@gmail.com</managingEditor>
        <webMaster>j.matthew.morrison1@gmail.com</webMaster>
        <generator>Super Ultra RSS Generator Swag 3000</generator>
        <docs>https://www.rssboard.org/rss-specification</docs>
        ${posts.map(({ title, route, frontMatter }) => `
            <item>
                <title>${title}</title>
                <link>${URL}${route}</link>
                <guid>${URL}${route}</guid>
                <description>${frontMatter.description}</description>
                <pubDate>${new Date(frontMatter.date).toUTCString()}</pubDate>
            </item>
        `)}
    </channel>
</rss>`;

    return new Response(feed, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
