import 'bootstrap/dist/css/bootstrap.min.css';
import '/styles/index.scss';
import Layout from '@/components/layout';

export default function MyApp({ Component, pageProps }) {
    return (
        <div className="App">
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </div>
    );
}
