import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/works.module.scss';
import { galleryItems } from '@/constants/works';

export default function WorksPage() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [fade, setFade] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleClick = (item, index) => {
        setSelectedImage(item);
        setCurrentIndex(index);
        setFade(true);
        setTimeout(() => {
            setFade(false);
        }, 250);
    };

    const handleClose = () => {
        setSelectedImage(null);
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            const updatedIndex = currentIndex - 1;
            setTimeout(() => {
                setSelectedImage(galleryItems[updatedIndex]);
            }, 250);
            setCurrentIndex(updatedIndex);
            setFade(true);
        }
    };

    const handleNext = () => {
        if (currentIndex < galleryItems.length - 1) {
            const updatedIndex = currentIndex + 1;
            setTimeout(() => {
                setSelectedImage(galleryItems[updatedIndex]);
            }, 250);
            setCurrentIndex(updatedIndex);
            setFade(true);
        }
    };

    useEffect(() => {
        if (fade) {
            const timer = setTimeout(() => {
                setFade(false);
            }, 250);
            return () => clearTimeout(timer);
        }
    }, [fade]);

    const isFirstImage = currentIndex === 0;
    const isLastImage = currentIndex === galleryItems.length - 1;

    return (
        <section className="container pt-4">
            <Head>
                <title>
                    ИнтерТентСервис - Галерея - Изготовление и Ремонт Тентов для
                    Автомобилей и Прицепов
                </title>
                <meta
                    name="description"
                    content="Тенты Минск - ИнтерТентСервис - В данном разделе можно ознакомится с примерами наших работ."
                />
            </Head>
            <header className="text-center">
                <h1>Примеры наших робот</h1>
            </header>
            <div className="row">
                {galleryItems.map((item, index) => (
                    <div key={index} className="col-md-4 col-lg-3 my-3">
                        <article>
                            <figure>
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={300}
                                    height={300}
                                    className={
                                        'img-fluid ' + styles.galleryImage
                                    }
                                    onClick={() => handleClick(item, index)}
                                />
                                {/*<figcaption>{item.title}</figcaption>*/}
                            </figure>
                        </article>
                    </div>
                ))}
            </div>

            {selectedImage && (
                <aside className={styles.overlay}>
                    <div className={styles.imageContainer}>
                        <figure>
                            <Image
                                src={selectedImage.image}
                                alt={selectedImage.title}
                                width={1000}
                                height={1000}
                                className={`img-fluid ${
                                    fade ? styles.fadeOut : ''
                                }`}
                            />
                            {/*<figcaption>{selectedImage.title}</figcaption>*/}
                        </figure>
                        {!isFirstImage && (
                            <button
                                className={
                                    styles.galleryButton +
                                    ' ' +
                                    styles.prevButton
                                }
                                onClick={handlePrev}
                                aria-label="Previous image"
                            >
                                ‹
                            </button>
                        )}
                        {!isLastImage && (
                            <button
                                className={
                                    styles.galleryButton +
                                    ' ' +
                                    styles.nextButton
                                }
                                onClick={handleNext}
                                aria-label="Next image"
                            >
                                ›
                            </button>
                        )}
                        <button
                            className={styles.closeButton}
                            onClick={handleClose}
                            aria-label="Close image view"
                        >
                            ×
                        </button>
                    </div>
                </aside>
            )}
        </section>
    );
}
