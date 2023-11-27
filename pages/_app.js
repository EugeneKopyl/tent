// pages/_app.js
import '/styles/index.scss';
// import NavBar from '@/components/NavBar';
// import Footer from '@/components/Footer';

function MyApp({ Component, pageProps }) {
    return (
        <div className="App">
            {/*<NavBar />*/}
            <Component {...pageProps} />
            {/*<Footer />*/}
        </div>
    );
}

export default MyApp;

// // pages/index.js
// import HomePage from '../components/HomePage';
//
// export default function Home() {
//     return <HomePage />;
// }
//
// // pages/services.js
// import ServicesPage from '../components/ServicesPage';
//
// export default function Services() {
//     return <ServicesPage />;
// }
//
// // pages/parts.js
// import PartsPage from '../components/PartsPage';
//
// export default function Parts() {
//     return <PartsPage />;
// }
//
// // pages/works.js
// import WorksPage from '../components/WorksPage';
//
// export default function Works() {
//     return <WorksPage />;
// }
//
// // pages/about.js
// import AboutPage from '../components/AboutPage';
//
// export default function About() {
//     return <AboutPage />;
// }
//
// // pages/contacts.js
// import ContactsPage from '../components/ContactsPage';
//
// export default function Contacts() {
//     return <ContactsPage />;
// }
