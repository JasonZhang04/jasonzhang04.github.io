import { labs } from '@/lib/labs';

const aliases = labs
  .flatMap((lab) => lab.aliases.map((alias) => ({ alias, lab })))
  .sort((a, b) => b.alias.length - a.alias.length);
const pattern = new RegExp(`(${aliases.map(({ alias }) => alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`);

/** Renders copy unchanged, turning each lab name into a link to the lab's own page. */
export function LabText({ text }: { text: string }) {
  return <>{text.split(pattern).map((part, i) => {
    const hit = aliases.find(({ alias }) => alias === part);
    return hit
      ? <a key={i} className="inline-link" href={hit.lab.href} target="_blank" rel="noreferrer" title={hit.lab.full}>{part}</a>
      : part;
  })}</>;
}
