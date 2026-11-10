import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PixelIcon } from '@/components/pixel-icon';
import { CourseTable } from '@/components/course-table';
import { courses } from '@/lib/courses';

export const metadata: Metadata = {
  title: 'Coursework | Chenjia Zhang',
  description: 'Courses Chenjia Zhang has taken at Johns Hopkins University, across artificial intelligence, applied mathematics and statistics, and computer science.',
};

export default function CoursesPage() {
  return <>
    <a className="skip-link" href="#courses-main">Skip to courses</a>
    <SiteHeader offHome />
    <main id="courses-main" className="course-index wide">
      <p className="meta-label">Background / Coursework</p>
      <h1>Coursework</h1>
      <p className="course-lede">{courses.length} courses at Johns Hopkins University. Each one has its own page, where course materials can be linked later.</p>
      <CourseTable name="course-area-index" />
      <a className="text-link course-back" href="/#coursework"><PixelIcon name="arrow-left" /> Back to the academic profile</a>
    </main>
    <div className="wide"><SiteFooter note="© 2026 Chenjia Zhang" /></div>
  </>;
}
