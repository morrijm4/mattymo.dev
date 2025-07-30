import 'nextra-theme-blog/style.css';
import type { Metadata } from 'next';
import { Head } from 'nextra/components';
import { Footer, Layout, Navbar, ThemeSwitch } from 'nextra-theme-blog';
import type { PropsWithChildren } from 'react';
import { getPageMap } from 'nextra/page-map';

export const metadata: Metadata = {
    title: 'mattymo.dev',
};

export default async function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en" className='dark' style={{ colorScheme: 'dark' }}>
            <Head backgroundColor={{ dark: '#24273a', light: '#eff1f5' }} />
            <body>
                <Layout>
                    <Navbar pageMap={await getPageMap()}>
                        <ThemeSwitch />
                    </Navbar>
                    {children}
                    <Footer>
                        <abbr
                            title="This site and all its content are licensed under a Creative Commons Attribution-NonCommercial 4.0 International License."
                            style={{ cursor: 'help' }}
                        >
                            CC BY-NC 4.0
                        </abbr>{' '}
                        {new Date().getFullYear()} © Matthew Morrison.
                        <a href="/feed.xml" style={{ float: 'right' }}>
                            RSS
                        </a></Footer>
                </Layout>
            </body>
        </html >
    );
}
