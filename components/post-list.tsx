import { type Post, formatDate } from '@/lib/blog';

/** List of blog posts, newest first. */
export function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul className="post-list">
      {posts.map((p) => (
        <li key={p.slug}>
          <p className="post-meta"><span>{formatDate(p.date)}</span><span>{p.kind}</span><span>{p.minutes} min read</span></p>
          <a className="post-title" href={`/blog/${p.slug}/`}>{p.title}</a>
          <p className="post-summary">{p.summary}</p>
        </li>
      ))}
    </ul>
  );
}
