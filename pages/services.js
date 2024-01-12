import React from 'react';
import styles from '../styles/services.module.scss';
import { serviceItems } from '@/constants/services';
import Image from 'next/image';

const SimpleCard = ({ card: { image, title, description }, imagePosition }) => {
    return (
        <div
            itemprop="itemListElement"
            itemscope=""
            itemtype="https://schema.org/Offer"
        >
            <article
                className={`${styles.cardContainer} text-center ${
                    imagePosition === 'right' ? styles.right : styles.left
                }`}
                itemprop="itemOffered"
                itemscope=""
                itemtype="https://schema.org/Service"
            >
                <figure className={styles.cardImage} itemprop="image">
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
    return (
        <div
            className="container my-3 pt-4"
            itemscope=""
            itemtype="https://schema.org/Service"
        >
            <meta itemprop="name" content="Изготовление и ремонт тентов" />
            <h1>Наши услуги</h1>
            <section
                itemprop="hasOfferCatalog"
                itemscope=""
                itemtype="https://schema.org/OfferCatalog"
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
