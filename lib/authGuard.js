import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export function useAuthGuard() {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsChecking(true);

                const response = await fetch('/api/admin/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    router.push('/admin/login');
                    return;
                }

                setIsChecking(false);
            } catch (error) {
                console.error('Auth check failed:', error);
                router.push('/');
            }
        };

        checkAuth();
    }, [router]);

    return { isChecking };
}

export function withAuthGuard(WrappedComponent) {
    return function AuthGuardedComponent(props) {
        const { isChecking } = useAuthGuard();

        if (isChecking) {
            return (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: '100vh' }}
                >
                    <div className="text-muted">Checking authentication...</div>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };
}

export function AdminPage({ children }) {
    const { isChecking } = useAuthGuard();

    if (isChecking) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: '100vh' }}
            >
                <div className="text-muted">Checking authentication...</div>
            </div>
        );
    }

    return children;
}
