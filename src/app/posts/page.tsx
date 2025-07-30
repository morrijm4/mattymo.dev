import { PostCard } from 'nextra-theme-blog';
import { getPosts } from './get-posts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Posts',
    description: 'A list of all posts on mattymo.dev.',
};

export default async function Posts() {
    const posts = await getPosts();
    console.log('posts', posts);

    return (
        <div>
            <h1>Posts</h1>
            {posts.map(p => <PostCard key={p.route} post={p} />)}
        </div>
    );
}
