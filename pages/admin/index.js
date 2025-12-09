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
        redirect: {
            destination: '/admin/dashboard',
            permanent: false,
        },
    };
}

export default function AdminIndex() {
    return null;
}
