import { profile, research, projects } from '@/lib/profile';
import { publications, researchStatus } from '@/lib/publications';
import { featuredPhoto, photographs } from '@/lib/photography';
import { quote, favorites } from '@/lib/other-things';
import { courses } from '@/lib/courses';
import { slugify } from '@/lib/slug';
import { smallerProjects } from '@/lib/smaller-projects';
import { researchArt, projectArt, hobbies } from '@/lib/site-art';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { NightLab } from '@/components/night-lab';
import { PixelObject } from '@/components/pixel-object';
import { PixelIcon } from '@/components/pixel-icon';
import { EcgDivider } from '@/components/ecg-divider';
import { SectionHeading } from '@/components/section-heading';
import { ProfilePhoto } from '@/components/profile-photo';
import { LabText } from '@/components/lab-text';
import { CourseTable } from '@/components/course-table';

const TIMELINE: { date: string; sub?: string; title: string; role: string; detail: string; coursework?: boolean }[] = [
  { date: '2023–2027', sub: 'Expected May 2027', title: 'Johns Hopkins University', role: 'B.S. in Applied Mathematics and Statistics, Computer Science', detail: 'Minor in Visual Arts', coursework: true },
  { date: 'Summer 2026-present', title: 'SCAI Lab', role: 'Research Assistant', detail: 'Multi-agent communication and optimization' },
  { date: 'Summer 2026–present', title: 'TIRI Lab', role: 'Research Assistant & DSAI Summer Intern', detail: 'Supervised by Professor Casey Taylor' },
  { date: 'Fall 2024-present', title: 'Computational Intensive Care Medicine Lab', role: 'Research Assistant', detail: 'Supervised by Professor Robert Stevens' },
];

export default function Home() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader />
    <main id="main">
      <section className="hero wide" aria-labelledby="hero-name">
        <div className="hero-copy">
          <p className="meta-label">Research &amp; Academic Profile</p>
          <h1 id="hero-name">Chenjia<br />Zhang</h1>
          <p className="hero-tagline">Learning from data. <em>Understanding intelligence.</em></p>
          <p className="hero-summary">My work spans machine learning for healthcare and intelligent agents.</p>
          <dl className="hero-status">
            <div><dt>Now</dt><dd>Undergraduate researcher<br />Johns Hopkins University</dd></div>
            <div><dt>Focus</dt><dd>Healthcare ML / Multi-agent systems</dd></div>
            <div><dt>Degree</dt><dd>B.S. expected May 2027</dd></div>
            <div><dt>Based</dt><dd>Baltimore, Maryland</dd></div>
          </dl>
          <div className="hero-links">
            <a className="button button-primary" href="#research">Explore my research <PixelIcon name="arrow-down" /></a>
            <a className="button" href={`mailto:${profile.email}`}><PixelIcon name="mail" /> Email</a>
            <a className="button" href={profile.github} target="_blank" rel="noreferrer"><PixelIcon name="code" /> GitHub</a>
          </div>
        </div>
        <NightLab caption="A space for research, projects, and ideas." />
      </section>

      <EcgDivider at={72} />

      <section id="about" className="about wide" aria-labelledby="about-title">
        <SectionHeading label="00 / About" title="Hello, I’m Chenjia" id="about-title" />
        <div className="about-grid">
          <ProfilePhoto />
          <div className="about-copy">
            <p className="about-lead">{profile.introduction}</p>
            <p><LabText text={profile.researchIntro} /></p>
          </div>
          <aside className="glance" aria-label="Profile at a glance">
            <p className="meta-label">At a glance</p>
            <dl>
              <div><dt>Majors</dt><dd>Applied Mathematics &amp; Statistics<br />Computer Science</dd></div>
              <div><dt>Minor</dt><dd>Visual Arts</dd></div>
              <div><dt>Degree</dt><dd>B.S. expected May 2027</dd></div>
              <div><dt>Location</dt><dd>Baltimore, Maryland</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <EcgDivider at={24} />

      <section id="research" className="wide" aria-labelledby="research-title">
        <SectionHeading label="01 / Research" title="Selected research" note="Questions I’m working on" id="research-title" />
        <div className="card-grid">
          {research.map((item) => (
            <article id={item.id} className="card" key={item.id}>
              <div className="card-top">
                <PixelObject name={researchArt[item.id].object} label={researchArt[item.id].label} />
                <div>
                  <p className="meta-label card-category">{item.number} / {item.category}</p>
                  <p className={`status${item.status === 'Ongoing' ? ' status-live' : ''}`}>{item.status}</p>
                  <h3>{item.title}</h3>
                </div>
              </div>
              <p className="card-lab"><LabText text={item.lab} /></p>
              <p className="card-text">{item.description}</p>
              {researchStatus[item.id] && <p className="card-status">{researchStatus[item.id]}</p>}
              <ul className="tags">{item.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <EcgDivider at={58} />

      <section id="publications" className="wide" aria-labelledby="writing-title">
        <SectionHeading label="02 / Writing" title="Selected writing" note="Hopefully more to come*" id="writing-title" />
        {[...new Set(publications.map((p) => p.year))].map((year) => (
          <div className="pub-year" key={year}>
            <p className="pub-year-label">{year}</p>
            <div className="pub-list">
              {publications.filter((p) => p.year === year).map((pub) => (
                <article className="pub" key={pub.title}>
                  <div className="pub-head">
                    <PixelObject name={pub.object} label={pub.object === 'ecg-cart' ? 'Pixel illustration of an ECG monitor on a wheeled cart.' : 'Pixel illustration of a lightbox showing a stylised chest film.'} />
                    <div>
                      <p className="meta-label">{pub.venue}</p>
                      <h3>{pub.title}</h3>
                      <p className="pub-authors">
                        {pub.authors.map((author, i) => (
                          <span key={author}>{author === profile.name ? <strong>{author}</strong> : author}{i < pub.authors.length - 1 ? ', ' : ''}</span>
                        ))}
                      </p>
                      <p className="pub-note">{pub.note}</p>
                    </div>
                  </div>
                  {pub.href && (
                    <div className="pub-actions">
                      <a className="button button-primary" href={pub.href} target="_blank" rel="noreferrer">Read preprint <PixelIcon name="arrow-up-right" /></a>
                      {pub.bibtex && (
                        <button className="button copy-button" type="button" data-copy={pub.bibtex}>
                          <PixelIcon name="copy" className="copy-idle" />
                          <PixelIcon name="check" className="copy-done" />
                          <span data-copy-label>Copy BibTeX</span>
                        </button>
                      )}
                    </div>
                  )}
                  {pub.abstract && (
                    <details className="disclosure">
                      <summary>Abstract</summary>
                      <div className="disclosure-body">
                        {pub.abstract.map(([heading, text]) => <p key={heading}><strong>{heading}.</strong> {text}</p>)}
                        <p className="disclosure-note">Reproduced from the preprint, CC BY 4.0.</p>
                      </div>
                    </details>
                  )}
                  {pub.bibtex && (
                    <details className="disclosure">
                      <summary>BibTeX</summary>
                      <div className="disclosure-body"><pre tabIndex={0}>{pub.bibtex}</pre></div>
                    </details>
                  )}
                </article>
              ))}
            </div>
          </div>
        ))}
        <p className="footnote">*Reviewer 2 permitting.</p>
      </section>

      <EcgDivider at={36} />

      <section id="projects" className="wide" aria-labelledby="projects-title">
        <SectionHeading label="03 / Explorations" title="Selected course projects" note="Learning through building" id="projects-title" />
        <div className="card-grid">
          {projects.map((project) => (
            <article key={project.title} id={slugify(project.title)} className="card">
              <div className="card-top">
                <PixelObject name={projectArt[project.title].object} label={projectArt[project.title].label} />
                <div>
                  <p className="meta-label card-category">{project.label}</p>
                  <h3>{project.title}</h3>
                </div>
              </div>
              <p className="card-text">{project.description}</p>
              {project.href && <a className="text-link" href={project.href} target="_blank" rel="noreferrer">{project.linkLabel} <PixelIcon name="arrow-up-right" /></a>}
            </article>
          ))}
        </div>
        <div className="smaller">
          <h3 className="smaller-title">Smaller projects</h3>
          <ul className="smaller-list">
            {smallerProjects.map((p) => (
              <li key={p.title} id={slugify(p.title)}>
                <p className="meta-label">{p.label}</p>
                <p className="smaller-name">{p.title}</p>
                <p className="smaller-text">{p.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <EcgDivider at={82} />

      <section id="experience" className="wide" aria-labelledby="experience-title">
        <SectionHeading label="04 / Background" title="Education & experience" id="experience-title" />
        <div className="timeline">
          {TIMELINE.map((row) => (
            <div className="timeline-row" key={row.title}>
              <p className="timeline-date">{row.date}{row.sub && <span>{row.sub}</span>}</p>
              <div>
                <h3><LabText text={row.title} /></h3>
                <p>{row.role}</p>
                <p className="timeline-detail">{row.detail}</p>
                {row.coursework && <a className="text-link timeline-coursework" href="#coursework">{courses.length} courses <PixelIcon name="arrow-down" /></a>}
              </div>
            </div>
          ))}
          <div className="timeline-row">
            <p className="timeline-date">Selected honors</p>
            <div className="honors">
              <p>Whiting School of Engineering Dean’s List, 2023–2026</p>
              <p>Rensselaer Medal Award for Math &amp; Science, 2023</p>
            </div>
          </div>
        </div>
        <details className="coursework" id="coursework">
          <summary>
            <span className="coursework-title">Coursework</span>
            <span className="coursework-count">{courses.length} courses · {courses.filter((c) => c.area === 'ai').length} AI · {courses.filter((c) => c.area === 'ams').length} AMS · {courses.filter((c) => c.area === 'cs').length} CS</span>
            <span className="coursework-toggle" aria-hidden="true" />
          </summary>
          <div className="coursework-body">
            <CourseTable name="course-area-home" />
            <a className="text-link" href="/courses/">Every course has its own page <PixelIcon name="arrow-up-right" /></a>
          </div>
        </details>
      </section>

      <EcgDivider at={14} />

      <section id="beyond" className="beyond wide" aria-labelledby="beyond-title">
        <SectionHeading label="Beyond research" title="Through another lens." id="beyond-title" />
        <div className="beyond-grid">
          <figure className="print">
            <a className="print-mat" href={`/photography/#${featuredPhoto.id}`} aria-label={`${featuredPhoto.title}: view it in the photography collection`}>
              <img
                src={featuredPhoto.src}
                srcSet={`${featuredPhoto.small} 800w, ${featuredPhoto.src} ${featuredPhoto.width}w`}
                sizes="(max-width: 960px) 100vw, 640px"
                width={featuredPhoto.width}
                height={featuredPhoto.height}
                loading="lazy"
                alt={featuredPhoto.alt}
              />
            </a>
            <figcaption>
              <span className="print-title">{featuredPhoto.title}</span>
              <span className="print-index">{String(photographs.indexOf(featuredPhoto) + 1).padStart(2, '0')} / {String(photographs.length).padStart(2, '0')}</span>
            </figcaption>
          </figure>
          <div className="beyond-side">
            <div className="beyond-copy">
              <p>Photography, painting, and life outside the lab.</p>
              <a className="text-link" href="/photography/">Explore my photography <PixelIcon name="arrow-up-right" /></a>
            </div>
            <ul className="hobbies">
              {hobbies.map((h) => (
                <li key={h.name}>
                  <PixelObject name={h.object} label={h.label} />
                  {h.href ? <a href={h.href}>{h.name}</a> : <span>{h.name}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <EcgDivider at={64} />

      <section id="other" className="other wide" aria-labelledby="other-title">
        <SectionHeading label="Uncategorized" title="Other things" id="other-title" />
        <figure className="quote-card">
          <PixelObject name="bugs" label="Pixel illustration of two beetles that double when you hover over them." />
          <blockquote><p>“{quote.text}”</p></blockquote>
          <figcaption>{quote.note}</figcaption>
        </figure>
        <div className="faves">
          {favorites.map((f) => (
            <section className="fave" key={f.title} aria-labelledby={`fave-${slugify(f.title)}`}>
              <PixelObject name={f.object} label={f.label} />
              <h3 id={`fave-${slugify(f.title)}`}>{f.title}</h3>
              <ol>{f.items.map((item, i) => <li key={item}><span className="fave-index">{String(i + 1).padStart(2, '0')}</span>{item}</li>)}</ol>
              <p className="fave-note">{f.note}</p>
            </section>
          ))}
        </div>
      </section>

      <EcgDivider at={46} />

      <section id="contact" className="contact wide" aria-labelledby="contact-title">
        <SectionHeading label="Let’s connect" title="Continue the conversation." id="contact-title" />
        <div className="contact-row">
          <img className="contact-painting" src="/profile_avatar_240.jpeg" width={120} height={120} loading="lazy" alt="Painted portrait of Chenjia Zhang." />
          <div>
            <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email} <PixelIcon name="arrow-up-right" /></a>
            <a className="text-link" href={profile.github} target="_blank" rel="noreferrer"><PixelIcon name="code" /> GitHub <PixelIcon name="arrow-up-right" /></a>
          </div>
        </div>
      </section>
    </main>
    <div className="wide"><SiteFooter note="© 2026 Chenjia Zhang · Last updated November 2026" /></div>
  </>;
}
