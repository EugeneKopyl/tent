import RandomImageGallery from '../components/RandomImageGallery';
import styles from '../styles/home.module.scss';

export default function Index() {
    return (
        <div className={styles.homePage}>
            <header className={styles.homeBanner}></header>

            <div className="container py-4">
                <h1>Добро пожаловать в нашу компанию!</h1>
                <p>
                    Мы специализируемся на ремонте и производстве тентов и
                    каркасов для автомобилей и прицепов.
                </p>

                <div className={styles.contentWrapper}>
                    <main className={styles.mainContent}>
                        <p>
                            Наши услуги включают создание и ремонт тентов для
                            автомобилей и прицепов, работу с каркасами и
                            сдвижными крышами, а также продажу запчастей и
                            ремонт ворот для прицепов.
                        </p>
                    </main>
                    <div className={styles.sidebar}>
                        <RandomImageGallery />
                    </div>
                </div>
            </div>
        </div>
    );
}
