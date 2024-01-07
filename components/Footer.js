import React from 'react';
import styles from '../styles/footer.module.scss';
import { navItems } from '@/constants/menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Footer() {
    const pathname = usePathname();

    const openMap = () => {
        const address = 'улица Бабушкина, 27к5, Минск';
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        let mapUrl;

        if (isMobile) {
            mapUrl = 'geo:0,0?q=' + encodeURIComponent(address);

            const a = document.createElement('a');
            a.setAttribute('href', mapUrl);
            a.setAttribute('target', '_blank');

            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
            });

            a.dispatchEvent(clickEvent);
        } else {
            mapUrl = 'https://yandex.by/maps/-/CDeMB055';
            window.open(mapUrl);
        }
    };

    return (
        <footer className={`${styles.footer} pt-4 pb-3 px-0 container-fluid`}>
            <div className="container px-3 pt-2 d-flex align-items-start flex-row flex-wrap">
                <div
                    className={`${styles.footer__logo} d-flex align-items-start pb-5 pb-xl-0`}
                >
                    <Link href="/" className="me-2 d-block">
                        <Image
                            className="interLogo"
                            loading="lazy"
                            src="/images/inter_logo.svg"
                            width={150}
                            height={40}
                            alt="Логотип ИнтерТентСервис"
                        />
                    </Link>
                </div>
                <div
                    className={`d-flex align-items-start px-sm-2 pt-1 ${styles.footer__contactInfo}`}
                >
                    <ul className="pe-2 list-unstyled">
                        <li
                            className={`${styles.navItem} d-flex align-items-center`}
                        >
                            <span className="me-3 d-inline-block">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-telephone-fill"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
                                    />
                                </svg>
                            </span>
                            <span>Телефон:</span>
                        </li>
                        <li className={styles.navItem}>
                            <span className={styles.hiddenText}>Телефон:</span>
                        </li>
                        <li className={styles.navItem}>
                            <span className="me-3 d-inline-block">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-clock"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                                </svg>
                            </span>
                            <span>Время работы:</span>
                        </li>
                        <li className={styles.navItem}>
                            <span className="me-3 d-inline-block">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-geo-alt"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                </svg>
                            </span>
                            <span>Адрес:</span>
                        </li>
                    </ul>
                    <ul className="list-unstyled">
                        <li className={styles.navItem}>
                            <Link href="tel:+375293761761" className="col-12">
                                +375 (29) 376-17-61
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link
                                href="tel:+375447171617"
                                className="nav-item col-12"
                            >
                                +375 (44) 717-16-17
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            по будням 08:30 – 17:30
                        </li>
                        <li
                            className={styles.navItem}
                            onClick={openMap}
                            style={{ cursor: 'pointer' }}
                        >
                            <address className="m-0">
                                улица Бабушкина, 27к5, Минск
                            </address>
                        </li>
                    </ul>
                </div>
                <nav
                    className={`${styles.footer__nav} me-auto d-flex flex-fill`}
                >
                    <ul className="px-sm-2 list-unstyled">
                        {navItems.map((link, index) => (
                            <li key={index}>
                                <Link
                                    href={link.url}
                                    className={`nav-link ${
                                        pathname === link.url
                                            ? `${styles.active}`
                                            : ''
                                    } ${styles.navItem}`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className={`${styles.footer__socialInfo} px-sm-2`}>
                    <div className={styles.navItem}>Подпишитесь на нас:</div>
                    <div className="float-start">
                        <Link
                            aria-label="наш инстаграм"
                            href="https://www.instagram.com/tentminsk"
                            className={`${styles.navItem__socialLink} align-items-center justify-content-center me-2`}
                        >
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M16 9C12.1317 9 9 12.1351 9 16C9 19.8683 12.1351 23 16 23C19.8683 23 23 19.8649 23 16C23 12.1317 19.8649 9 16 9V9ZM16 20.5435C13.489 20.5435 11.4565 18.5099 11.4565 16C11.4565 13.4901 13.4901 11.4565 16 11.4565C18.5099 11.4565 20.5435 13.4901 20.5435 16C20.5447 18.5099 18.511 20.5435 16 20.5435V20.5435Z"
                                    fill="#9D9EB4"
                                />
                                <path
                                    d="M21.3606 3.08167C18.9686 2.97009 13.0438 2.9755 10.6497 3.08167C8.54583 3.18025 6.69008 3.68832 5.194 5.18438C2.69366 7.68467 3.01325 11.0538 3.01325 15.9948C3.01325 21.0517 2.73158 24.3428 5.194 26.8052C7.70408 29.3141 11.122 28.9859 16.0046 28.9859C21.0139 28.9859 22.7429 28.9891 24.5142 28.3034C26.9224 27.3685 28.7403 25.2159 28.9179 21.3496C29.0306 18.9566 29.0241 13.033 28.9179 10.6389C28.7034 6.07487 26.254 3.307 21.3606 3.08167V3.08167ZM25.1468 25.1509C23.5078 26.79 21.2338 26.6438 15.9732 26.6438C10.5565 26.6438 8.38441 26.7239 6.7995 25.1347C4.97408 23.318 5.3045 20.4006 5.3045 15.9774C5.3045 9.99213 4.69025 5.68162 10.6973 5.37396C12.0775 5.32521 12.4837 5.30896 15.958 5.30896L16.0067 5.34146C21.7798 5.34146 26.3093 4.73697 26.5812 10.7429C26.6429 12.1133 26.657 12.5249 26.657 15.9937C26.6559 21.3474 26.7578 23.5325 25.1468 25.1509V25.1509Z"
                                    fill="#9D9EB4"
                                />
                                <path
                                    d="M22.5 11C23.3284 11 24 10.3284 24 9.5C24 8.67157 23.3284 8 22.5 8C21.6716 8 21 8.67157 21 9.5C21 10.3284 21.6716 11 22.5 11Z"
                                    fill="#9D9EB4"
                                />
                            </svg>
                        </Link>
                        <Link
                            aria-label="наш телеграм"
                            href="https://t.me/TENTMINSKOLYADICHI"
                            className={`${styles.navItem__socialLink} align-items-center justify-content-center me-2`}
                        >
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12.987 19.1585L12.5238 25.5801C13.1865 25.5801 13.4735 25.2995 13.8177 24.9626L16.9246 22.0358L23.3624 26.683C24.5431 27.3315 25.3749 26.99 25.6934 25.6123L29.9192 6.09461L29.9204 6.09346C30.2949 4.37306 29.2892 3.70032 28.1388 4.12237L3.29991 13.496C1.6047 14.1446 1.63037 15.0761 3.01173 15.4981L9.36205 17.445L24.1126 8.34744C24.8068 7.89435 25.4379 8.14505 24.9188 8.59814L12.987 19.1585Z"
                                    fill="#9D9EB4"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
