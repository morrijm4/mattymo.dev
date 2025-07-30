import { PostCard } from 'nextra-theme-blog';
import { getPosts } from './get-posts';

export default async function Posts() {
    const posts = await getPosts();

    return (
        <div>
            <h1>Posts</h1>
            {posts.map(p => <PostCard key={p.route} post={p} />)}
        </div>
    );
}
