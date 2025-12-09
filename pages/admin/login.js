import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ErrorBoundary from '../../components/ErrorBoundary';

function AdminLoginContent() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/admin/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    router.push('/admin/dashboard');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            }
        };

        checkAuth();
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                setError('Ошибка сервера. Попробуйте позже.');
                setLoading(false);
                return;
            }

            if (response.ok) {
                router.push('/admin/dashboard');
            } else {
                let errorMessage = data.message || 'Ошибка входа';

                if (
                    data.remainingAttempts !== undefined &&
                    data.remainingAttempts >= 0
                ) {
                    errorMessage += ` (Осталось попыток: ${data.remainingAttempts})`;
                }

                if (response.status === 429) {
                    errorMessage =
                        data.message ||
                        'Слишком много попыток входа. Попробуйте позже.';
                }

                if (response.status === 500) {
                    errorMessage = 'Ошибка сервера. Попробуйте позже.';
                }

                setError(errorMessage);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Ошибка сети. Проверьте подключение и попробуйте снова.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <meta
                    name="robots"
                    content="noindex, nofollow, nosnippet, noarchive"
                />
                <meta name="googlebot" content="noindex, nofollow" />
            </Head>
            <div
                className="d-flex align-items-center justify-content-center bg-gradient mt-4 mb-4"
                style={{
                    background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
            >
                <div
                    className="card shadow-lg"
                    style={{ width: '100%', maxWidth: '400px' }}
                >
                    <div className="card-body p-4">
                        <h1 className="text-center mb-4 text-dark">
                            Admin Login
                        </h1>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label
                                    htmlFor="username"
                                    className="form-label"
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    className="form-control"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="mb-3">
                                <label
                                    htmlFor="password"
                                    className="form-label"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="form-control"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {error && (
                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function AdminLogin() {
    return (
        <ErrorBoundary>
            <AdminLoginContent />
        </ErrorBoundary>
    );
}
