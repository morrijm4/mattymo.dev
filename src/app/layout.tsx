import 'nextra-theme-blog/style.css';
import './globals.css'
import type { Metadata } from 'next';
import Image from 'next/image';
import { Head } from 'nextra/components';
import { Footer, Layout, Navbar } from 'nextra-theme-blog';
import type { PropsWithChildren } from 'react';
import { getPageMap } from 'nextra/page-map';
import { Roboto_Mono } from 'next/font/google';
import { RSS } from './icons/rss';

export const metadata: Metadata = {
    title: 'mattymo.dev',
};

const roboto = Roboto_Mono({
    subsets: ['latin'],
});

export default async function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en" className={roboto.className + ' dark'} style={{ colorScheme: 'dark' }}>
            <Head backgroundColor={{ dark: '#24273a', light: '#eff1f5' }} />
            <body>
                <Layout>
                    <Navbar pageMap={await getPageMap()} />
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
                                    <Image src="/github.svg" alt="GitHub" width={16} height={16} className='m-0' />
                                </a>
                                <a href='https://www.linkedin.com/in/james-matthew-morrison/'>
                                    <Image src="/linkedin-logo.png" alt="Linkedin" width={16} height={16} className='m-0' />
                                </a>
                                <a href="/feed.xml">
                                    <RSS className="fill-white" width={16} />
                                </a>
                            </div>
                        </div>
                    </Footer>
                </Layout>
            </body>
        </html >
    );
}
