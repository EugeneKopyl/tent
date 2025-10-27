import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminIndex() {
    const router = useRouter();

    useEffect(() => {
        router.push('/admin/login');
    }, [router]);

    return (
        <div className="min-vh-100 d-flex justify-content-center align-items-center">
            <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Redirecting to admin login...</p>
            </div>
        </div>
    );
}
