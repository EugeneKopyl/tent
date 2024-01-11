import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { navItems } from '@/constants/menu';
import Link from 'next/link';
import Image from 'next/image';

export default function NavBar() {
    const [expanded, setExpanded] = useState(false);
    const pathname = usePathname();

    const handleNavItemClick = () => {
        setExpanded(false);
    };

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
        <Navbar
            sticky="top"
            collapseOnSelect
            expand="lg"
            className="bg-body-tertiary"
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
        >
            <Container className="flex-wrap">
                <div
                    className="row m-0 w-100"
                    itemscope=""
                    itemtype="https://schema.org/AutoRepair"
                >
                    <div
                        className="col-12 col-md-4 p-2"
                        itemprop="address"
                        itemscope=""
                        itemtype="https://schema.org/PostalAddress"
                    >
                        <button
                            className="d-flex p-0"
                            onClick={openMap}
                            style={{
                                cursor: 'pointer',
                                background: 'none',
                                border: 'none',
                            }}
                            aria-label="Открыть карту"
                        >
                            <address className="m-0 d-flex align-items-center">
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
                                <span itemprop="streetAddress">
                                    улица Бабушкина, 27к5
                                </span>
                                <span>,&nbsp;</span>
                                <span itemprop="addressLocality">Минск</span>
                            </address>
                        </button>
                    </div>
                    <div className="col-6 col-md-4 p-2">
                        <div className="d-flex">
                            <div className="me-3 d-inline-block">
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
                            </div>
                            <div itemprop="openingHours">
                                <time>8:30-17:00</time>
                                <div>выходной: СБ, ВС</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 p-2">
                        <div className="d-flex flex-wrap text-center">
                            <a href="tel:+375293761761" className="col-12 bold">
                                <span className="me-3 d-inline-block">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
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
                            <a
                                href="tel:+375447171617"
                                className="col-12 bold ms-3"
                            >
                                <span itemprop="telephone">
                                    +375 (44) 717-16-17
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
                <Link href="/" className="p-0">
                    <Image
                        src={'images/inter_logo.svg'}
                        width={170}
                        height={45}
                        className="d-inline-block align-top"
                        alt="Логотип компании"
                    />
                </Link>
                <Navbar.Toggle
                    aria-controls="basic-navbar-nav"
                    aria-label="Переключить навигацию"
                />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {navItems.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url}
                                className={`nav-link ${
                                    pathname === link.url ? 'active' : ''
                                }`}
                                onClick={handleNavItemClick}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
