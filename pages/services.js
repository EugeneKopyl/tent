import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/services.module.scss';
import { serviceItems } from '@/constants/services';

const SimpleCard = ({ card: { image, title, description }, imagePosition }) => {
    return (
        <div
            itemProp="itemListElement"
            itemScope=""
            itemType="https://schema.org/Offer"
        >
            <article
                className={`${styles.cardContainer} text-center ${
                    imagePosition === 'right' ? styles.right : styles.left
                }`}
                itemProp="itemOffered"
                itemScope=""
                itemType="https://schema.org/Service"
            >
                <figure className={styles.cardImage} itemProp="image">
                    <Image
                        src={image || 'images/main_logo.jpg'}
                        alt={title}
                        width={400}
                        height={400}
                    />
                </figure>
                <div className={styles.cardContent}>
                    <h3 itemProp="name">{title}</h3>
                    <p itemProp="description">{description}</p>
                </div>
                <meta itemProp="serviceType" content={title} />
            </article>
        </div>
    );
};

export default function ServicesPage() {
    const getBaseUrl = () => {
        if (typeof window !== 'undefined') {
            return window.location.origin;
        }
        return '';
    };

    const serviceCatalogSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Изготовление и ремонт тентов',
        description:
            'Услуги по ремонту и изготовлению тентов для автомобилей, грузовиков и прицепов, ремонт каркасов',
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Каталог услуг',
            itemListElement: serviceItems.map((card) => ({
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Service',
                    name: card.title,
                    description: card.description,
                    image:
                        card.image?.startsWith('http') ||
                        card.image?.startsWith('data:image/')
                            ? card.image
                            : `${getBaseUrl()}/${card.image || 'images/main_logo.jpg'}`,
                    serviceType: card.title,
                },
            })),
        },
    };

    return (
        <div
            className="container my-3 pt-4"
            itemScope=""
            itemType="https://schema.org/Service"
        >
            <Head>
                <title>
                    ИнтерТентСервис - Услуги - Изготовление и Ремонт Тентов для
                    Автомобилей и Прицепов
                </title>
                <meta
                    name="description"
                    content="ИнтерТентСервис - Услуги по ремонту и изготовлению тентов для автомобилей, грузовиков и прицепов, ремонт каркасов."
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(serviceCatalogSchema),
                    }}
                />
            </Head>
            <meta itemProp="name" content="Изготовление и ремонт тентов" />
            <h1>Наши услуги</h1>
            <section
                itemProp="hasOfferCatalog"
                itemScope=""
                itemType="https://schema.org/OfferCatalog"
            >
                {serviceItems.map((card, index) => (
                    <SimpleCard
                        imagePosition={index % 2 === 0 ? 'left' : 'right'}
                        card={card}
                        key={index}
                    />
                ))}
            </section>
        </div>
    );
}
