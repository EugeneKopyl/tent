import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/home.module.scss';
import RandomImageGallery from '../components/RandomImageGallery';

export default function Index() {
    return (
        <div
            className={styles.homePage}
            itemscope=""
            itemtype="https://schema.org/ImageObject"
        >
            <Head>
                <title>
                    ИнтерТентСервис - Главная - Изготовление и Ремонт Тентов для
                    Автомобилей и Прицепов
                </title>
                <meta
                    name="description"
                    content="ИнтерТентСервис - Профессиональный ремонт и изготовление тентов для автомобилей, грузовиков и прицепов, ремонт каркасов и продажа запчастей."
                />
            </Head>
            <Image
                src="/images/banner.jpg"
                alt="content image"
                width={1900}
                height={475}
                className={styles.homeBanner}
                itemprop="contentUrl"
            />

            <div className="container py-4">
                <h1>Добро пожаловать в нашу компанию!</h1>
                <p>
                    Мы специализируемся на ремонте и производстве тентов и
                    каркасов для автомобилей и прицепов.
                </p>

                <div className={styles.contentWrapper}>
                    <section className={styles.mainContent}>
                        <p>
                            Наши услуги включают создание и ремонт тентов для
                            автомобилей и прицепов, работу с каркасами и
                            сдвижными крышами, а также продажу запчастей и
                            ремонт ворот для прицепов.
                        </p>
                    </section>
                    <div className={styles.sidebar}>
                        <RandomImageGallery />
                    </div>
                </div>
            </div>
        </div>
    );
}
