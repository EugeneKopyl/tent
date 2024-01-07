// import './AboutPage.scss';
// import React from 'react';
import styles from '../styles/about.module.scss';

export default function About() {
    return (
        <div className="container pt-4">
            <header className="text-center">
                <h1 className={styles.header}>О нас</h1>
            </header>
            <section
                className={styles.aboutSection}
                aria-labelledby="about-description"
            >
                <h2 id="about-description" className="visually-hidden">
                    Основная информация о компании
                </h2>
                <ul className="about-list">
                    <li className={styles.aboutListItem}>
                        Начиная с 2017 года, наша компания работает на рынке
                        тентов и каркасов, предлагая только высококачественные
                        решения.
                    </li>
                    <li className={styles.aboutListItem}>
                        Наша миссия — использование инновационных технологий для
                        создания долговечных и надежных тентовых конструкций.
                    </li>
                    <li className={styles.aboutListItem}>
                        Мы стремимся к тому, чтобы наше качество и сервис
                        задавали стандарты в отрасли и гарантировали полное
                        удовлетворение потребностей клиентов.
                    </li>
                    <li className={styles.aboutListItem}>
                        Благодаря страстной работе наших сотрудников и
                        постоянному стремлению к совершенству, мы достигаем
                        впечатляющих результатов в каждом проекте.
                    </li>
                </ul>
            </section>
            <section
                className={styles.aboutSection}
                aria-labelledby="values-section"
            >
                <h2 id="values-section" className="visually-hidden">
                    Наши ценности
                </h2>
                <ul className="about-list">
                    <li className={styles.aboutListItem}>
                        Прозрачность — мы предоставляем полную информацию о всех
                        аспектах нашей работы и стоимости услуг.
                    </li>
                    <li className={styles.aboutListItem}>
                        Ответственность — мы берем на себя ответственность за
                        каждый этап работы и обеспечиваем высокий уровень
                        профессионализма и безопасности.
                    </li>
                    <li className={styles.aboutListItem}>
                        Инновации — мы постоянно внедряем новые технологии и
                        улучшения, чтобы предложить наилучшие решения в
                        индустрии.
                    </li>
                </ul>
            </section>
        </div>
    );
}
