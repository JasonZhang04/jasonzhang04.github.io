import { ArrowUpRight } from 'lucide-react';
import { profile } from '@/lib/profile';

export function SiteHeader({ photography = false }: { photography?: boolean }) {
  return (
    <header className="site-header">
      <a className="site-identity" href="/" aria-label={`${profile.name}, academic profile`}>
        <img src="/profile_avatar.jpeg" width={38} height={38} className="site-avatar" alt="" />
        <span>{profile.name}</span>
      </a>
      <nav aria-label="Main navigation">
        {photography ? <>
          <a href="/">Academic profile <ArrowUpRight size={13} aria-hidden="true" /></a>
          <a href="/photography/" aria-current="page">Photography</a>
        </> : <>
          <a href="#about">About</a><a href="#research">Research</a>
          <a href="#publications">Writing</a><a href="#projects">Projects</a>
          <a href="/photography/">Photos</a>
          <a href="#contact">Contact <ArrowUpRight size={13} aria-hidden="true" /></a>
        </>}
      </nav>
    </header>
  );
}
