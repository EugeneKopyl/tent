import React from 'react';
import Head from 'next/head';
import styles from '../styles/contacts.module.scss';

export default function ContactsPage() {
    const openMap = () => {
        const address = 'улица Бабушкина, 27к5, Минск';
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        let mapUrl;

        if (isMobile) {
            mapUrl = 'geo:0,0?q=' + encodeURIComponent(address);
        } else {
            // mapUrl = 'https://maps.app.goo.gl/113Z2dYA7ynDJSeDA'; // google
            mapUrl = 'https://yandex.by/maps/-/CDeMB055'; // yandex
        }

        window.open(mapUrl);
    };

    return (
        <section
            className="container py-4"
            itemscope=""
            itemtype="https://schema.org/AutoRepair"
        >
            <Head>
                <title>
                    ИнтерТентСервис - Контакты - Изготовление и Ремонт Тентов
                    для Автомобилей и Прицепов
                </title>
                <meta
                    name="description"
                    content="Тенты Минск - ИнтерТентСервис - Мы находимся: г.Минск, улица Бабушкина, 27к5. Консультация и наличие запчастей: +375 (29) 376-17-61."
                />
            </Head>
            <meta itemprop="name" content="Изготовление и ремонт тентов" />
            <header className="row visually-hidden">
                <div className="col-sm-12 text-center">
                    <h1 className="py-1">Контакты:</h1>
                </div>
            </header>
            <section className="row">
                <div
                    className="col-sm-6 p-3"
                    itemprop="address"
                    itemscope=""
                    itemtype="https://schema.org/PostalAddress"
                >
                    <h2>Как нас найти</h2>
                    <address onClick={openMap} style={{ cursor: 'pointer' }}>
                        <strong itemprop="name">
                            ООО &quot;ИнтерТентСервис&quot;
                        </strong>
                        <br />
                        <br />
                        <span className="me-3 d-inline-block">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                className="bi bi-geo-alt"
                                viewBox="0 0 16 16"
                            >
                                <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                                <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                            </svg>
                        </span>
                        <span itemprop="streetAddress">
                            улица Бабушкина, 27к5
                        </span>
                        {', '}
                        <span itemprop="addressLocality">Минск</span>
                    </address>
                    <div>
                        <a href="tel:+375293761761">
                            <span className="me-3 d-inline-block">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    className="bi bi-telephone-fill"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                                </svg>
                            </span>
                            <span itemprop="telephone">
                                +375 (29) 376-17-61
                            </span>
                        </a>
                        <br />
                        <br />
                        <a href="tel:+375447171617">
                            <span className="me-3 d-inline-block">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    className="bi bi-telephone-fill"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                                </svg>
                            </span>
                            <span itemprop="telephone">
                                +375 (44) 717-16-17
                            </span>
                        </a>
                        <br />
                        <br />
                        <a
                            href="mailto:intertentservice@gmail.com"
                            itemprop="email"
                        >
                            <span className="me-3 d-inline-block">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    className="bi bi-envelope"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                                </svg>
                            </span>
                            intertentservice@gmail.com
                        </a>
                    </div>
                </div>
                <div className="col-sm-6 p-3">
                    <h2>Режим работы</h2>
                    <table
                        className="table table-sm"
                        itemprop="openingHoursSpecification"
                        itemscope=""
                        itemtype="https://schema.org/OpeningHoursSpecification"
                    >
                        <tbody>
                            <tr>
                                <th scope="row" itemprop="name">
                                    <link
                                        itemprop="dayOfWeek"
                                        href="https://schema.org/Monday"
                                    />
                                    Понедельник
                                </th>
                                <td>
                                    <time
                                        datetime="08:30:00"
                                        itemprop="opens"
                                        content="08:30"
                                    >
                                        08:30
                                    </time>
                                    {' – '}
                                    <time
                                        datetime="17:30:00"
                                        itemprop="closes"
                                        content="17:30"
                                    >
                                        17:30
                                    </time>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" itemprop="name">
                                    <link
                                        itemprop="dayOfWeek"
                                        href="https://schema.org/Tuesday"
                                    />
                                    Вторник
                                </th>
                                <td>
                                    <time
                                        datetime="08:30:00"
                                        itemprop="opens"
                                        content="08:30"
                                    >
                                        08:30
                                    </time>
                                    {' – '}
                                    <time
                                        datetime="17:30:00"
                                        itemprop="closes"
                                        content="17:30"
                                    >
                                        17:30
                                    </time>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" itemprop="name">
                                    <link
                                        itemprop="dayOfWeek"
                                        href="https://schema.org/Wednesday"
                                    />
                                    Среда
                                </th>
                                <td>
                                    <time
                                        datetime="08:30:00"
                                        itemprop="opens"
                                        content="08:30"
                                    >
                                        08:30
                                    </time>
                                    {' – '}
                                    <time
                                        datetime="17:30:00"
                                        itemprop="closes"
                                        content="17:30"
                                    >
                                        17:30
                                    </time>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" itemprop="name">
                                    <link
                                        itemprop="dayOfWeek"
                                        href="https://schema.org/Thursday"
                                    />
                                    Четверг
                                </th>
                                <td>
                                    <time
                                        datetime="08:30:00"
                                        itemprop="opens"
                                        content="08:30"
                                    >
                                        08:30
                                    </time>
                                    {' – '}
                                    <time
                                        datetime="17:30:00"
                                        itemprop="closes"
                                        content="17:30"
                                    >
                                        17:30
                                    </time>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" itemprop="name">
                                    <link
                                        itemprop="dayOfWeek"
                                        href="https://schema.org/Friday"
                                    />
                                    Пятница
                                </th>
                                <td>
                                    <time
                                        datetime="08:30:00"
                                        itemprop="opens"
                                        content="08:30"
                                    >
                                        08:30
                                    </time>
                                    {' – '}
                                    <time
                                        datetime="17:30:00"
                                        itemprop="closes"
                                        content="17:30"
                                    >
                                        17:30
                                    </time>
                                </td>
                            </tr>
                            <tr className="table-danger">
                                <th scope="row" itemprop="name">
                                    <link
                                        itemprop="dayOfWeek"
                                        href="https://schema.org/Saturday"
                                    />
                                    Суббота
                                </th>
                                <td>Выходной</td>
                            </tr>
                            <tr className="table-danger">
                                <th scope="row" itemprop="name">
                                    <link
                                        itemprop="dayOfWeek"
                                        href="https://schema.org/Sunday"
                                    />
                                    Воскресенье
                                </th>
                                <td>Выходной</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
            <section
                itemprop="geo"
                itemscope=""
                itemtype="https://schema.org/GeoCoordinates"
            >
                <h2>Мы на карте:</h2>
                <meta itemprop="latitude" content="53.808243" />
                <meta itemprop="longitude" content="27.591853" />
                <div className={styles.mapContainer}>
                    <a
                        href="https://yandex.com/maps/org/remont_tentov_i_karkasov/221655374096/?utm_medium=mapframe&utm_source=maps"
                        style={{
                            color: '#eee',
                            fontSize: '12px',
                            position: 'absolute',
                            top: '0px',
                        }}
                    >
                        Ремонт тентов и каркасов
                    </a>
                    <iframe
                        src="https://yandex.com/map-widget/v1/?ll=27.591719%2C53.807769&mode=search&oid=221655374096&ol=biz&sctx=ZAAAAAgBEAAaKAoSCSJTPgRVlztAES%2FgZYaN6EpAEhIJfEYiNIKNvz8Rr8%2Bc9SnHpD8iBgABAgMEBSgKOABA%2B54GSAFqAnVhnQHNzEw9oAEAqAEAvQGt3EWpwgEGkLLC3bkG6gEA8gEA%2BAEAggIK0YLQtdC90YLRi4oCFjE4NDEwNzQyNyQxNzQ0MDQ5ODQ0NTCSAgCaAgxkZXNrdG9wLW1hcHM%3D&sll=27.591719%2C53.807769&sspn=0.007045%2C0.003167&text=%D1%82%D0%B5%D0%BD%D1%82%D1%8B&z=17.68"
                        width="100%"
                        height="400"
                        title="Наше местоположение на карте"
                    ></iframe>
                </div>
            </section>
        </section>
    );
}
