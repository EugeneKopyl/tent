import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../styles/news.module.scss';

export default function NewsDetailPage() {
    const router = useRouter();
    const { slug } = router.query;
    const [newsItem, setNewsItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!slug) return;

        const fetchNews = async () => {
            try {
                const preview = router.query.preview === 'true';
                const url = `/api/news?slug=${slug}${preview ? '&preview=true' : ''}`;
                const res = await fetch(url);
                if (!res.ok) {
                    if (res.status === 404) {
                        setError('Новость не найдена');
                    } else {
                        setError('Ошибка загрузки новости');
                    }
                    return;
                }
                const data = await res.json();
                setNewsItem(data);
            } catch (err) {
                console.error('Error fetching news:', err);
                setError('Ошибка загрузки новости');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [slug, router.query.preview]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="container pt-4">
                <div className="text-center py-5">
                    <div className="spinner-border text-dark" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                    </div>
                    <p className="mt-3">Загружаем новость...</p>
                </div>
            </div>
        );
    }

    if (error || !newsItem) {
        return (
            <div className="container pt-4">
                <div className="text-center py-5">
                    <h2>Ошибка</h2>
                    <p>{error || 'Новость не найдена'}</p>
                    <Link href="/news" className="btn btn-primary">
                        Вернуться к списку новостей
                    </Link>
                </div>
            </div>
        );
    }

    const getBaseUrl = () => {
        if (typeof window !== 'undefined') {
            return window.location.origin;
        }
        return '';
    };

    const getFullImageUrl = (imageUrl) => {
        if (!imageUrl) return '';
        if (imageUrl.startsWith('data:image/') || imageUrl.startsWith('http')) {
            return imageUrl;
        }
        return `${getBaseUrl()}${imageUrl}`;
    };

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: newsItem.title,
        description: newsItem.shortDescription || newsItem.title,
        image: newsItem.previewImage
            ? getFullImageUrl(newsItem.previewImage)
            : `${getBaseUrl()}/logo512.png`,
        datePublished: newsItem.publishedAt || newsItem.createdAt,
        dateModified:
            newsItem.updatedAt || newsItem.publishedAt || newsItem.createdAt,
        author: {
            '@type': 'Organization',
            name: 'ИнтерТентСервис',
        },
        publisher: {
            '@type': 'Organization',
            name: 'ИнтерТентСервис',
            logo: {
                '@type': 'ImageObject',
                url: `${getBaseUrl()}/logo512.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${getBaseUrl()}/news/${newsItem.slug}`,
        },
        articleSection: newsItem.category?.name,
        url: `${getBaseUrl()}/news/${newsItem.slug}`,
    };

    return (
        <div className="container pt-4">
            <Head>
                <title>{newsItem.title} - ИнтерТентСервис - Новости</title>
                <meta
                    name="description"
                    content={newsItem.shortDescription || newsItem.title}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(articleSchema),
                    }}
                />
            </Head>

            <div className="mb-3">
                <Link href="/news" className="btn btn-sm btn-outline-secondary">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="12"
                        viewBox="0 0 10 16"
                        fill="none"
                        className={'me-2'}
                    >
                        <path
                            d="M7.60933 0L0 7.60933L7.60933 15.2187L9.49467 13.3333L3.77067 7.60933L9.49467 1.88533L7.60933 0Z"
                            fill="currentColor"
                        />
                    </svg>
                    Назад к новостям
                </Link>
            </div>

            <article
                className={styles.newsDetail}
                itemScope
                itemType="https://schema.org/NewsArticle"
            >
                <header className="mb-4">
                    {newsItem.category && (
                        <span
                            className={`badge mb-2 ${styles.categoryBadge}`}
                            itemProp="articleSection"
                        >
                            {newsItem.category.name}
                        </span>
                    )}
                    <h1 className={styles.newsDetailTitle} itemProp="headline">
                        {newsItem.title}
                    </h1>
                    <div className="text-muted mb-3">
                        <small>
                            <time
                                itemProp="datePublished"
                                dateTime={
                                    newsItem.publishedAt || newsItem.createdAt
                                }
                            >
                                {formatDate(
                                    newsItem.publishedAt || newsItem.createdAt,
                                )}
                            </time>
                        </small>
                    </div>
                </header>

                {newsItem.previewImage && (
                    <div className={`mb-4 ${styles.newsDetailImageContainer}`}>
                        {newsItem.previewImage.startsWith('data:image/') ? (
                            <img
                                src={newsItem.previewImage}
                                alt={newsItem.title}
                                className={`img-fluid ${styles.newsDetailImage}`}
                                itemProp="image"
                            />
                        ) : (
                            <img
                                src={newsItem.previewImage}
                                alt={newsItem.title}
                                className={`img-fluid ${styles.newsDetailImage}`}
                                itemProp="image"
                            />
                        )}
                    </div>
                )}

                <div
                    className={`${styles.newsContent} ql-editor`}
                    dangerouslySetInnerHTML={{ __html: newsItem.content }}
                    itemProp="articleBody"
                />
                <meta
                    itemProp="description"
                    content={newsItem.shortDescription || newsItem.title}
                />
                <div
                    itemProp="author"
                    itemScope
                    itemType="https://schema.org/Organization"
                    style={{ display: 'none' }}
                >
                    <span itemProp="name">ИнтерТентСервис</span>
                </div>
                <div
                    itemProp="publisher"
                    itemScope
                    itemType="https://schema.org/Organization"
                    style={{ display: 'none' }}
                >
                    <span itemProp="name">ИнтерТентСервис</span>
                    <div
                        itemProp="logo"
                        itemScope
                        itemType="https://schema.org/ImageObject"
                    >
                        <meta
                            itemProp="url"
                            content={`${getBaseUrl()}/logo512.png`}
                        />
                    </div>
                </div>
            </article>
        </div>
    );
}
