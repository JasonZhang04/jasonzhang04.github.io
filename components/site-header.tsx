import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { profile } from '@/lib/profile';

export function SiteHeader({ photography = false }: { photography?: boolean }) {
  return (
    <header className="site-header">
      <Link className="site-identity" href="/" aria-label={`${profile.name}, academic profile`}>
        <img src="/profile_avatar.jpeg" width={38} height={38} className="site-avatar" alt="" />
        <span>{profile.name}</span>
      </Link>
      <nav aria-label="Main navigation">
        {photography ? <>
          <Link href="/">Academic profile <ArrowUpRight size={13} aria-hidden="true" /></Link>
          <Link href="/photography" aria-current="page">Photography</Link>
        </> : <>
          <a href="#about">About</a><a href="#research">Research</a>
          <a href="#publications">Writing</a><a href="#projects">Projects</a>
          <a href="#contact">Contact <ArrowUpRight size={13} aria-hidden="true" /></a>
        </>}
      </nav>
    </header>
  );
}
