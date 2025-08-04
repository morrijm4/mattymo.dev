import { PostCard } from 'nextra-theme-blog';
import { getPosts } from './get-posts';

export default async function Posts() {
    const posts = await getPosts();

    return (
        <div>
            <h1>Posts</h1>
            {posts.map(p => <PostCard key={p.route} post={p} />)}
            <PostCard post={{
                route: '/snake',
                frontMatter: {
                    author: 'Matthew Morrison',
                    title: 'Snake',
                    date: '2025-08-04T21:49:20.330Z',
                    description: 'Play the game Snake!',
                }
            }} />
        </div>
    );
}
