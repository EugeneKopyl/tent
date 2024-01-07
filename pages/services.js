import React from 'react';
import styles from '../styles/services.module.scss';
import { serviceItems } from '@/constants/services';
import Image from 'next/image';

const SimpleCard = ({ card: { image, title, description }, imagePosition }) => {
    return (
        <article
            className={`${styles.cardContainer} text-center ${
                imagePosition === 'right' ? styles.right : styles.left
            }`}
        >
            <figure className={styles.cardImage}>
                <Image
                    src={image || 'images/main_logo.jpg'}
                    alt={title}
                    width={400}
                    height={400}
                />
            </figure>
            <div className={styles.cardContent}>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </article>
    );
};

export default function ServicesPage() {
    return (
        <main className="container my-3 pt-4">
            <h1>Наши услуги</h1>
            <section>
                {serviceItems.map((card, index) => (
                    <SimpleCard
                        imagePosition={index % 2 === 0 ? 'left' : 'right'}
                        card={card}
                        key={card.id || index}
                    />
                ))}
            </section>
        </main>
    );
}
