import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ErrorBoundary from '../../components/ErrorBoundary';

function AdminRegisterContent() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/admin/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(
                    'Admin account created successfully! Redirecting...',
                );
                setTimeout(() => {
                    router.push('/admin/dashboard');
                }, 1500);
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center bg-gradient mt-4 mb-4"
            style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
        >
            <div
                className="card shadow-lg"
                style={{ width: '100%', maxWidth: '500px' }}
            >
                <div className="card-body p-4">
                    <h1 className="text-center mb-4 text-dark">
                        Admin Registration
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label
                                    htmlFor="firstName"
                                    className="form-label"
                                >
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="col-md-6">
                                <label
                                    htmlFor="lastName"
                                    className="form-label"
                                >
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="form-control"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-control"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label
                                    htmlFor="password"
                                    className="form-label"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                    disabled={loading}
                                    minLength={6}
                                />
                            </div>

                            <div className="col-md-6">
                                <label
                                    htmlFor="confirmPassword"
                                    className="form-label"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                    disabled={loading}
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="alert alert-success" role="alert">
                                {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading
                                ? 'Creating Account...'
                                : 'Create Admin Account'}
                        </button>
                    </form>

                    <div className="mt-2 text-center">
                        <button
                            onClick={() => router.push('/admin/login')}
                            className="btn btn-link text-decoration-none p-0"
                        >
                            Login here
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminRegister() {
    return (
        <ErrorBoundary>
            <AdminRegisterContent />
        </ErrorBoundary>
    );
}
