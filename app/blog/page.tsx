import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PixelIcon } from '@/components/pixel-icon';
import { PostList } from '@/components/post-list';
import { getPosts, POST_KINDS } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog | Chenjia Zhang',
  description: 'Notes by Chenjia Zhang: thoughts, inspirations, early findings, and research experiences.',
};

export default function BlogPage() {
  const posts = getPosts();
  return <>
    <a className="skip-link" href="#blog-main">Skip to posts</a>
    <SiteHeader offHome current="blog" />
    <main id="blog-main" className="blog-index wide">
      <p className="meta-label">Blog</p>
      <h1>Notes in progress</h1>
      <p className="blog-lede">Inspirations, early findings, and research experiences that are worth writing down before they are ready to be a paper. Informal by design.</p>
      <dl className="blog-kinds">
        {Object.entries(POST_KINDS).map(([kind, text]) => <div key={kind}><dt>{kind}</dt><dd>{text}</dd></div>)}
      </dl>
      {posts.length ? <PostList posts={posts} /> : <p className="blog-empty">No posts yet. The first ones are still at the “promising preliminary results” stage.</p>}
      <a className="text-link course-back" href="/"><PixelIcon name="arrow-left" /> Back to the academic profile</a>
    </main>
    <div className="wide"><SiteFooter note="© 2026 Chenjia Zhang" /></div>
  </>;
}
