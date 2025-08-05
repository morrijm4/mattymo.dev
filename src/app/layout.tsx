import 'nextra-theme-blog/style.css';
import './globals.css'
import type { Metadata } from 'next';
import { Head } from 'nextra/components';
import { Footer, Layout, Navbar, ThemeSwitch } from 'nextra-theme-blog';
import type { PropsWithChildren } from 'react';
import { getPageMap } from 'nextra/page-map';
import { Roboto_Mono } from 'next/font/google';
import { RSS } from './icons/rss';
import { GitHub } from './icons/github';
import { Linkedin } from './icons/linkedin-svgrepo-com';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
    title: 'mattymo.dev',
};

const roboto = Roboto_Mono({
    subsets: ['latin'],
});

const pageMap = await getPageMap();

export default async function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en" className={roboto.className + ' dark'} style={{ colorScheme: 'dark' }}>
            <Head backgroundColor={{ dark: '#24273a', light: '#eff1f5' }} />
            <body>
                <SpeedInsights />
                <Layout>
                    <Navbar pageMap={pageMap}>
                        <ThemeSwitch />
                    </Navbar>
                    {children}
                    <Footer>
                        <div className="flex justify-between">
                            <div>
                                <abbr
                                    title="This site and all its content are licensed under a Creative Commons Attribution-NonCommercial 4.0 International License."
                                    style={{ cursor: 'help' }}
                                >
                                    CC BY-NC 4.0
                                </abbr>{' '}
                                {new Date().getFullYear()} © Matthew Morrison.
                            </div>
                            <div className="flex space-x-2 items-center">
                                <a href='https://github.com/morrijm4/'>
                                    <GitHub width={16} height={16} className='fill-black dark:fill-white' />
                                </a>
                                <a href='https://www.linkedin.com/in/james-matthew-morrison/'>
                                    <Linkedin width={16} height={16} className='fill-black dark:fill-white' />
                                </a>
                                <a href="/feed.xml">
                                    <RSS className="fill-black dark:fill-white" width={16} />
                                </a>
                            </div>
                        </div>
                    </Footer>
                </Layout>
            </body>
        </html >
    );
}
