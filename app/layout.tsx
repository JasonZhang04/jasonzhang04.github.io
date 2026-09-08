import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
 metadataBase: new URL('https://chenjia-zhang.jhu.chatgpt.site'),
 title: 'Chenjia Zhang | Research & Academic Profile',
 description: 'Chenjia Zhang, Johns Hopkins undergraduate researcher. Machine learning for healthcare, multi-agent communication, optimization, and embodied intelligence.',
 icons: { icon: '/favicon.svg' },
 robots: { index: false, follow: false },
 openGraph: { title: 'Chenjia Zhang', description: 'Machine learning for healthcare · Multi-agent systems', type: 'website', url: 'https://chenjia-zhang.jhu.chatgpt.site', images: [{ url: 'https://chenjia-zhang.jhu.chatgpt.site/og.png', width: 1730, height: 909, alt: 'Chenjia Zhang — Machine learning for healthcare and multi-agent systems' }] },
 twitter: { card: 'summary_large_image', images: ['https://chenjia-zhang.jhu.chatgpt.site/og.png'], title: 'Chenjia Zhang', description: 'Machine learning for healthcare · Multi-agent systems' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="en"><body>{children}</body></html>;
}
