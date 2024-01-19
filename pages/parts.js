import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/parts.module.scss';
import { partsItems } from '@/constants/parts';

const PartsCard = ({ item }) => {
    return (
        <article
            className="col-6 col-md-4 col-lg-3 my-3"
            itemscope=""
            itemtype="https://schema.org/Product"
        >
            <div className={styles.cardItemContainer}>
                <Image
                    src={item.image}
                    alt={item.title}
                    width={300}
                    height={300}
                    className="img-fluid card-img-top"
                    itemprop="image"
                />
                <div className="card-body">
                    <h3 className={'p-2 m-0 ' + styles.cardItemTitle}>
                        <span
                            className={styles.titleText}
                            title={item.title}
                            itemprop="name"
                        >
                            {item.title}
                        </span>
                        <meta itemprop="description" content={item.title} />
                    </h3>
                </div>
                <span
                    itemprop="offers"
                    itemscope=""
                    itemtype="https://schema.org/Offer"
                    className={`${styles.textAvailability} p-2`}
                >
                    <meta itemprop="priceCurrency" content={item.currency} />
                    <meta itemprop="price" content={item.price} />
                    <link
                        itemprop="availability"
                        href="https://schema.org/InStock"
                    />
                    В наличии
                </span>
            </div>
        </article>
    );
};

export default function PartsPage() {
    const [searchText, setSearchText] = useState('');

    const handleChange = (event) => {
        setSearchText(event.target.value);
    };

    const filteredItems = partsItems.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase()),
    );

    return (
        <div
            className="container pt-4"
            itemscope=""
            itemtype="https://schema.org/OfferCatalog"
        >
            <Head>
                <title>
                    ИнтерТентСервис - Каталог запчастей - Изготовление и Ремонт
                    Тентов для Автомобилей и Прицепов
                </title>
                <meta
                    name="description"
                    content="ИнтерТентСервис - Широкий асортимент запчастей и аксессуаров для автомобилей."
                />
            </Head>
            <header className="text-center" itemprop="name">
                <h1>Каталог запчастей</h1>
            </header>
            <section aria-label="Поиск запчастей">
                <p itemprop="description">
                    Перечень запчастей представленный в каталоге может быть не
                    полный, наличие и цены уточняйте по телефону.
                </p>
                <div className={'mb-3 input-group ' + styles.inputGroup}>
                    <input
                        type="search"
                        className={'form-control ' + styles.formControl}
                        placeholder="Введите название запчасти"
                        aria-label="Поиск запчасти"
                        aria-describedby="search-icon"
                        value={searchText}
                        onChange={handleChange}
                    />
                    <span
                        className={'input-group-text ' + styles.inputGroupText}
                        id="search-icon"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-search"
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                        >
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                        </svg>
                    </span>
                </div>
            </section>
            <section aria-label="Каталог продукции">
                <div
                    className="row"
                    itemscope=""
                    itemtype="https://schema.org/OfferCatalog"
                >
                    {filteredItems.map((item, index) => (
                        <PartsCard key={index} item={item} />
                    ))}
                </div>
            </section>
        </div>
    );
}
