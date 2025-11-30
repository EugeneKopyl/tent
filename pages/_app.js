import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-quill-new/dist/quill.snow.css';
import '../styles/index.scss';
import Layout from '@/components/layout';

export default function MyApp({ Component, pageProps }) {
    return (
        <div className="App d-flex flex-column min-vh-100">
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </div>
    );
}
