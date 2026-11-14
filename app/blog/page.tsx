import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PixelIcon } from '@/components/pixel-icon';
import { PostList } from '@/components/post-list';
import { getPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog | Chenjia Zhang',
  description: 'Notes in progress by Chenjia Zhang.',
};

export default function BlogPage() {
  const posts = getPosts();
  return <>
    <a className="skip-link" href="#blog-main">Skip to posts</a>
    <SiteHeader offHome current="blog" />
    <main id="blog-main" className="blog-index wide">
      <p className="meta-label">Blog</p>
      <h1>Notes in progress</h1>
      {posts.length > 0 && <PostList posts={posts} />}
      <a className="text-link course-back" href="/"><PixelIcon name="arrow-left" /> Back to the academic profile</a>
    </main>
    <div className="wide"><SiteFooter note="© 2026 Chenjia Zhang" /></div>
  </>;
}
