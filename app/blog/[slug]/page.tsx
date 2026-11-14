import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PixelIcon } from '@/components/pixel-icon';
import { getPosts, formatDate } from '@/lib/blog';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPosts().find((p) => p.slug === slug);
  return { title: post ? `${post.title} | Blog | Chenjia Zhang` : 'Blog | Chenjia Zhang', description: post?.summary };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPosts().find((p) => p.slug === slug)!;
  return <>
    <a className="skip-link" href="#post-main">Skip to the post</a>
    <SiteHeader offHome current="blog" />
    <main id="post-main" className="post-page wide">
      <article>
        <p className="meta-label"><a href="/blog/">Blog</a> / {post.kind}</p>
        <h1>{post.title}</h1>
        <p className="post-meta"><span>{formatDate(post.date)}</span><span>{post.minutes} min read</span>{post.tags.map((t) => <span key={t}>#{t}</span>)}</p>
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
      <a className="text-link course-back" href="/blog/"><PixelIcon name="arrow-left" /> All posts</a>
    </main>
    <div className="wide"><SiteFooter note="© 2026 Chenjia Zhang" /></div>
  </>;
}
