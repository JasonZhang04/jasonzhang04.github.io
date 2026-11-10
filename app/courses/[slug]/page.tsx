import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PixelIcon } from '@/components/pixel-icon';
import { AREAS, courses, courseHref } from '@/lib/courses';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  return {
    title: course ? `${course.name} | Coursework | Chenjia Zhang` : 'Coursework | Chenjia Zhang',
    description: course ? `${course.name}, a ${AREAS[course.area].name} course Chenjia Zhang took at Johns Hopkins University.` : undefined,
  };
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug)!;
  const area = AREAS[course.area];
  const siblings = courses.filter((c) => c.area === course.area && c.slug !== course.slug);
  return <>
    <a className="skip-link" href="#course-main">Skip to course</a>
    <SiteHeader offHome />
    <main id="course-main" className="course-page wide">
      <p className="meta-label"><a href="/courses/">Coursework</a> / {area.name} / {course.code}</p>
      <h1>{course.name}</h1>
      <dl className="course-facts">
        <div><dt>Area</dt><dd>{area.name}</dd></div>
        <div><dt>Institution</dt><dd>Johns Hopkins University</dd></div>
        <div>
          <dt>Course website</dt>
          <dd>{course.website
            ? <a className="inline-link" href={course.website} target="_blank" rel="noreferrer">{course.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}&nbsp;<PixelIcon name="arrow-up-right" /></a>
            : <span className="course-none">Not linked yet</span>}</dd>
        </div>
      </dl>

      <section className="course-block" aria-labelledby="course-related">
        <h2 id="course-related">Related work on this site</h2>
        {course.related.length
          ? <ul className="course-links">{course.related.map((r) => <li key={r.href}><a href={r.href}>{r.label} <PixelIcon name="arrow-up-right" /></a></li>)}</ul>
          : <p className="course-none">Nothing from this course is on the site yet.</p>}
      </section>

      {course.website && course.embed && (
        <section className="course-block" aria-labelledby="course-embed">
          <div className="course-embed-head">
            <h2 id="course-embed">Course website</h2>
            <a className="text-link" href={course.website} target="_blank" rel="noreferrer">Open in a new tab <PixelIcon name="arrow-up-right" /></a>
          </div>
          <iframe className="course-frame" src={course.website} title={`${course.name} course website`} loading="lazy" referrerPolicy="no-referrer" />
        </section>
      )}

      {siblings.length > 0 && (
        <section className="course-block" aria-labelledby="course-more">
          <h2 id="course-more">More in {area.name}</h2>
          <ul className="course-links">{siblings.map((c) => <li key={c.slug}><a href={courseHref(c)}><span className="course-code">{c.code}</span> {c.name}</a></li>)}</ul>
        </section>
      )}

      <a className="text-link course-back" href="/courses/"><PixelIcon name="arrow-left" /> All coursework</a>
    </main>
    <div className="wide"><SiteFooter note="© 2026 Chenjia Zhang" /></div>
  </>;
}
