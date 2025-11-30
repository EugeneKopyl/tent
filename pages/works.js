import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/works.module.scss';
import { galleryItems } from '@/constants/works';

export default function WorksPage() {
    const [galleryItemsState, setGalleryItemsState] = useState(galleryItems);
    const [selectedImage, setSelectedImage] = useState(null);
    const [fade, setFade] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWorks() {
            try {
                const res = await fetch('/api/works');
                let dbWorks = [];
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        dbWorks = data.sort((a, b) => {
                            const dateA = a.createdAt
                                ? new Date(a.createdAt)
                                : new Date(0);
                            const dateB = b.createdAt
                                ? new Date(b.createdAt)
                                : new Date(0);
                            return dateB - dateA;
                        });
                    }
                }
                const combinedItems = [...dbWorks, ...galleryItems];
                setGalleryItemsState(combinedItems);
            } catch (error) {
                console.error('Error fetching works:', error);
                setGalleryItemsState(galleryItems);
            } finally {
                setLoading(false);
            }
        }
        fetchWorks();
    }, []);

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
                setSelectedImage(galleryItemsState[updatedIndex]);
            }, 250);
            setCurrentIndex(updatedIndex);
            setFade(true);
        }
    };

    const handleNext = () => {
        if (currentIndex < galleryItemsState.length - 1) {
            const updatedIndex = currentIndex + 1;
            setTimeout(() => {
                setSelectedImage(galleryItemsState[updatedIndex]);
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
    const isLastImage = currentIndex === galleryItemsState.length - 1;

    const getBaseUrl = () => {
        if (typeof window !== 'undefined') {
            return window.location.origin;
        }
        return '';
    };

    const imageGallerySchema = {
        '@context': 'https://schema.org',
        '@type': 'ImageGallery',
        name: 'Примеры наших работ',
        description: 'Галерея примеров работ по изготовлению и ремонту тентов для автомобилей и прицепов',
        numberOfItems: galleryItemsState.length,
        itemListElement: galleryItemsState.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'ImageObject',
                name: item.title || 'Пример работы',
                description: item.description || item.title || 'Пример работы',
                image: item.image?.startsWith('http') || item.image?.startsWith('data:image/')
                    ? item.image
                    : `${getBaseUrl()}/${item.image}`,
            },
        })),
    };

    return (
        <section className="container pt-4" itemScope itemType="https://schema.org/ImageGallery">
            <Head>
                <title>
                    ИнтерТентСервис - Галерея - Изготовление и Ремонт Тентов для
                    Автомобилей и Прицепов
                </title>
                <meta
                    name="description"
                    content="Тенты Минск - ИнтерТентСервис - В данном разделе можно ознакомится с примерами наших работ."
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGallerySchema) }}
                />
            </Head>
            <meta itemProp="name" content="Примеры наших работ" />
            <header className="text-center">
                <h1>Примеры наших робот</h1>
            </header>
            {loading ? (
                <div className="text-center p-5">Загрузка...</div>
            ) : (
                <div className="row">
                    {galleryItemsState.map((item, index) => {
                        const isDataUrl = item.image?.startsWith('data:image/');
                        const imageKey = item._id || item.image || index;
                        return (
                            <div
                                key={imageKey}
                                className="col-md-4 col-lg-3 my-3"
                                itemProp="itemListElement"
                                itemScope
                                itemType="https://schema.org/ListItem"
                            >
                                <article itemProp="item" itemScope itemType="https://schema.org/ImageObject">
                                    <meta itemProp="position" content={index + 1} />
                                    <figure itemProp="image">
                                        {isDataUrl ? (
                                            <img
                                                src={item.image}
                                                alt={item.title || 'Пример работы'}
                                                className={
                                                    'img-fluid ' +
                                                    styles.galleryImage
                                                }
                                                onClick={() =>
                                                    handleClick(item, index)
                                                }
                                                style={{
                                                    width: '100%',
                                                    height: 'auto',
                                                    cursor: 'pointer',
                                                }}
                                                itemProp="contentUrl"
                                            />
                                        ) : (
                                            <Image
                                                src={item.image}
                                                alt={item.title || 'Пример работы'}
                                                width={300}
                                                height={300}
                                                className={
                                                    'img-fluid ' +
                                                    styles.galleryImage
                                                }
                                                onClick={() =>
                                                    handleClick(item, index)
                                                }
                                                itemProp="contentUrl"
                                            />
                                        )}
                                    </figure>
                                    {item.title && (
                                        <meta itemProp="name" content={item.title} />
                                    )}
                                    {item.description && (
                                        <meta itemProp="description" content={item.description} />
                                    )}
                                </article>
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedImage && (
                <aside className={styles.overlay}>
                    <div className={styles.imageContainer}>
                        <figure>
                            {selectedImage.image?.startsWith('data:image/') ? (
                                <img
                                    src={selectedImage.image}
                                    alt={selectedImage.title}
                                    className={`img-fluid ${
                                        fade ? styles.fadeOut : ''
                                    }`}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '90vh',
                                    }}
                                />
                            ) : (
                                <Image
                                    src={selectedImage.image}
                                    alt={selectedImage.title}
                                    width={1000}
                                    height={1000}
                                    className={`img-fluid ${
                                        fade ? styles.fadeOut : ''
                                    }`}
                                />
                            )}
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
