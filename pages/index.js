import RandomImageGallery from '../components/RandomImageGallery';
import styles from '../styles/home.module.scss';
import Image from 'next/image';
import React from 'react';

export default function Index() {
    return (
        <div
            className={styles.homePage}
            itemscope
            itemtype="https://schema.org/ImageObject"
        >
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
                    <main className={styles.mainContent}>
                        <p>
                            Наши услуги включают создание и ремонт тентов для
                            автомобилей и прицепов, работу с каркасами и
                            сдвижными крышами, а также продажу запчастей и
                            ремонт ворот для прицепов.
                        </p>
                    </main>
                    <div className={styles.sidebar}>
                        <RandomImageGallery />
                    </div>
                </div>
            </div>
        </div>
    );
}
