import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Head from 'next/head';
import React from 'react';
import NextScript from 'next/script';

export default function Layout({ children }) {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <title>
                    Тенты Минск - Изготовление и Ремонт Тентов для Автомобилей и
                    Прицепов
                </title>
                <link rel="icon" href="/favicon.ico" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta name="theme-color" content="#ffffff" />
                <meta
                    name="description"
                    content="Тенты Минск - профессиональный ремонт и изготовление тентов для автомобилей, грузовиков и прицепов, а также ремонт и продажа запчастей и каркасов."
                />
                <link rel="apple-touch-icon" href="/logo192.png" />
                <link rel="manifest" href="/manifest.json" />

                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://tentminsk.by/" />
                <meta
                    property="og:title"
                    content="Тенты Минск - Изготовление и Ремонт Тентов"
                />
                <meta
                    property="og:description"
                    content="Профессиональные услуги по ремонту и изготовлению тентов для всех типов транспортных средств."
                />
                <meta property="og:image" content="/logo512.png" />

                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://tentminsk.by/" />
                <meta
                    property="twitter:title"
                    content="Тенты Минск - Изготовление и Ремонт Тентов"
                />
                <meta
                    property="twitter:description"
                    content="Профессиональные услуги по ремонту и изготовлению тентов для всех типов транспортных средств."
                />
                <meta property="twitter:image" content="/logo512.png" />
            </Head>
            <NextScript />

            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                          m[i].l=1*new Date();
                          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
                    
                        ym(95669644, "init", {
                          clickmap:true,
                          trackLinks:true,
                          accurateTrackBounce:true
                        });
                    `,
                }}
            />
            <noscript>
                <div>
                    <img
                        src="https://mc.yandex.ru/watch/95669644"
                        style={{ position: 'absolute', left: '-9999px' }}
                        alt=""
                    />
                </div>
            </noscript>
            <NavBar></NavBar>
            <main>{children}</main>
            <Footer></Footer>
        </>
    );
}
