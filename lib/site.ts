// Where the site lives. A public build sets SITE_URL (the GitHub Pages workflow does this,
// including any repository subpath). Without it, the build is a private preview that asks
// search engines not to index it.
export const SITE_URL = (process.env.SITE_URL || 'https://chenjia-zhang.jhu.chatgpt.site').replace(/\/+$/, '');
export const IS_PUBLIC = Boolean(process.env.SITE_URL);
export const absolute = (path: string) => `${SITE_URL}${path}`;
