import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/news.module.scss';

const NewsCard = ({ item }) => {
    const router = useRouter();

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleClick = () => {
        router.push(`/news/${item.slug}`);
    };

    const getFullImageUrl = (imageUrl) => {
        if (!imageUrl) return '';
        if (imageUrl.startsWith('data:image/') || imageUrl.startsWith('http')) {
            return imageUrl;
        }
        const baseUrl =
            typeof window !== 'undefined' ? window.location.origin : '';
        return `${baseUrl}${imageUrl}`;
    };

    const getArticleUrl = () => {
        const baseUrl =
            typeof window !== 'undefined' ? window.location.origin : '';
        return `${baseUrl}/news/${item.slug}`;
    };

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: item.title,
        description: item.shortDescription || item.title,
        image: getFullImageUrl(item.previewImage || '/logo512.png'),
        datePublished: item.publishedAt || item.createdAt,
        dateModified: item.updatedAt || item.publishedAt || item.createdAt,
        author: {
            '@type': 'Organization',
            name: 'ИнтерТентСервис',
        },
        publisher: {
            '@type': 'Organization',
            name: 'ИнтерТентСервис',
            logo: {
                '@type': 'ImageObject',
                url: `${typeof window !== 'undefined' ? window.location.origin : ''}/logo512.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': getArticleUrl(),
        },
        articleSection: item.category?.name,
        url: getArticleUrl(),
    };

    return (
        <article
            className="col-md-6 col-lg-4 my-3"
            itemScope
            itemType="https://schema.org/NewsArticle"
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(articleSchema),
                }}
            />
            <div
                className={`card h-100 ${styles.newsCard}`}
                onClick={handleClick}
            >
                <div className={styles.newsImageContainer}>
                    {item.previewImage?.startsWith('data:image/') ? (
                        <img
                            src={item.previewImage}
                            alt={item.title}
                            className={`card-img-top ${styles.newsImage}`}
                            itemProp="image"
                        />
                    ) : (
                        <img
                            src={item.previewImage || '/logo512.png'}
                            alt={item.title}
                            className={`card-img-top ${styles.newsImage}`}
                            itemProp="image"
                        />
                    )}
                </div>
                <div className="card-body d-flex flex-column">
                    {item.category && (
                        <span
                            className={`badge mb-2 ${styles.categoryBadge}`}
                            itemProp="articleSection"
                        >
                            {item.category.name}
                        </span>
                    )}
                    <h3
                        className={`card-title ${styles.newsTitle}`}
                        itemProp="headline"
                    >
                        {item.title}
                    </h3>
                    {item.shortDescription && (
                        <p
                            className={`card-text flex-grow-1 ${styles.newsDescription}`}
                            itemProp="description"
                        >
                            {item.shortDescription}
                        </p>
                    )}
                    <div className="mt-auto">
                        <small className="text-muted">
                            <time
                                itemProp="datePublished"
                                dateTime={item.publishedAt || item.createdAt}
                            >
                                {formatDate(item.publishedAt || item.createdAt)}
                            </time>
                        </small>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default function NewsPage() {
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [newsRes, categoriesRes] = await Promise.all([
                    fetch('/api/news'),
                    fetch('/api/news-categories'),
                ]);

                if (newsRes.ok) {
                    const newsData = await newsRes.json();
                    const normalizedData = (newsData || []).map((item) => {
                        if (!item.slug && item.title) {
                            item.slug = item.title
                                .toLowerCase()
                                .replace(/[^a-z0-9а-яё]+/gi, '-')
                                .replace(/(^-|-$)/g, '');
                        }
                        if (!item.previewImage) {
                            item.previewImage = '/logo512.png';
                        }
                        return item;
                    });
                    setNewsItems(normalizedData);
                }

                if (categoriesRes.ok) {
                    const categoriesData = await categoriesRes.json();
                    setCategories(categoriesData || []);
                }
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredNews = newsItems.filter((item) => {
        const isPublished = item.published === true;
        if (!isPublished) return false;

        if (selectedCategory === 'all') return true;

        if (!item.category) return false;

        const categoryId =
            typeof item.category === 'object'
                ? item.category._id || item.category.id || null
                : item.category;
        const categorySlug =
            typeof item.category === 'object'
                ? item.category.slug || null
                : null;

        const matchesId =
            categoryId &&
            (categoryId === selectedCategory ||
                String(categoryId) === String(selectedCategory));
        const matchesSlug = categorySlug && categorySlug === selectedCategory;

        return matchesId || matchesSlug;
    });

    const getBaseUrl = () => {
        if (typeof window !== 'undefined') {
            return window.location.origin;
        }
        return '';
    };

    const itemListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Новости ИнтерТентСервис',
        description: 'Последние новости и обновления в мире и внутри компании',
        itemListElement: filteredNews.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'NewsArticle',
                headline: item.title,
                description: item.shortDescription || item.title,
                image:
                    item.previewImage?.startsWith('http') ||
                    item.previewImage?.startsWith('data:image/')
                        ? item.previewImage
                        : `${getBaseUrl()}${item.previewImage || '/logo512.png'}`,
                datePublished: item.publishedAt || item.createdAt,
                url: `${getBaseUrl()}/news/${item.slug}`,
                articleSection: item.category?.name,
            },
        })),
    };

    return (
        <div className="container pt-4">
            <Head>
                <title>
                    ИнтерТентСервис - Новости - Изготовление и Ремонт Тентов для
                    Автомобилей и Прицепов
                </title>
                <meta
                    name="description"
                    content="ИнтерТентСервис - Последние новости и обновления в мире и внутри компании."
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(itemListSchema),
                    }}
                />
            </Head>
            <header className="text-center mb-4">
                <h1>Новости</h1>
            </header>

            {categories.length > 0 && (
                <section className="mb-4">
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                        <button
                            className={`btn btn-sm ${
                                selectedCategory === 'all'
                                    ? 'btn-secondary'
                                    : 'btn-outline-secondary'
                            }`}
                            onClick={() => setSelectedCategory('all')}
                        >
                            Все новости
                        </button>
                        {categories.map((cat) => {
                            const catId = cat._id || cat.id;
                            const catSlug = cat.slug;
                            const isSelected =
                                selectedCategory === catId ||
                                selectedCategory === catSlug ||
                                String(selectedCategory) === String(catId);

                            return (
                                <button
                                    key={catId || catSlug}
                                    className={`btn btn-sm ${
                                        isSelected
                                            ? 'btn-secondary'
                                            : 'btn-outline-secondary'
                                    }`}
                                    onClick={() =>
                                        setSelectedCategory(catId || catSlug)
                                    }
                                >
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>
                </section>
            )}

            <section>
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-dark" role="status">
                            <span className="visually-hidden">Загрузка...</span>
                        </div>
                        <p className="mt-3">Загружаем новости...</p>
                    </div>
                ) : filteredNews.length > 0 ? (
                    <div className="row">
                        {filteredNews.map((item) => (
                            <NewsCard key={item._id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <p>Новости не найдены</p>
                    </div>
                )}
            </section>
        </div>
    );
}
