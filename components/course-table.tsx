import { AREAS, courses, courseHref, type Area } from '@/lib/courses';
import { PixelIcon, type IconName } from '@/components/pixel-icon';

const AREA_ICON: Record<Area, IconName> = { ai: 'area-ai', ams: 'area-ams', cs: 'code' };

/** Filterable course table. Filters are radio inputs styled with CSS, so no script is needed. */
export function CourseTable({ name }: { name: string }) {
  const areas = Object.keys(AREAS) as Area[];
  return (
    <div className="courses">
      <div className="course-filter" role="radiogroup" aria-label="Filter courses by area">
        <label><input type="radio" name={name} value="all" defaultChecked /><span>All <b>{courses.length}</b></span></label>
        {areas.map((a) => (
          <label key={a}><input type="radio" name={name} value={a} /><span><PixelIcon name={AREA_ICON[a]} /> {AREAS[a].name} <b>{courses.filter((c) => c.area === a).length}</b></span></label>
        ))}
      </div>
      <table className="course-table">
        <thead><tr><th scope="col">No.</th><th scope="col">Course</th><th scope="col">Course site</th><th scope="col">On this site</th></tr></thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.slug} data-area={c.area}>
              <td className="course-code"><PixelIcon name={AREA_ICON[c.area]} /> {c.code}</td>
              <th scope="row"><a href={courseHref(c)}>{c.name}<PixelIcon name="arrow-up-right" /></a></th>
              <td className="course-site">
                {c.website
                  ? <a href={c.website} target="_blank" rel="noreferrer" aria-label={`${c.name} course website`}>{new URL(c.website).hostname.replace(/^www\./, '')} <PixelIcon name="arrow-up-right" /></a>
                  : <span className="course-none">–</span>}
              </td>
              <td className="course-related">
                {c.related.length ? c.related.map((r, i) => <span key={r.href}>{i > 0 && ', '}<a href={r.href}>{r.short}</a></span>) : <span className="course-none">–</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
