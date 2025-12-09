import AdminDashboardLayout from './AdminDashboardLayout';
import { checkServerAuth } from '@/lib/serverAuth';

export async function getServerSideProps(context) {
    const auth = await checkServerAuth(context.req);

    if (!auth) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}

export default AdminDashboardLayout;
