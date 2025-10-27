import React from 'react';
import { useRouter } from 'next/router';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error(
            'Admin Error Boundary caught an error:',
            error,
            errorInfo,
        );
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback error={this.state.error} />;
        }

        return this.props.children;
    }
}

function ErrorFallback({ error }) {
    const router = useRouter();

    const handleGoHome = () => {
        router.push('/');
    };

    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className="d-flex align-items-center justify-content-center p-4 bg-light flex-grow-1">
            <div
                className="card shadow-sm"
                style={{ maxWidth: '500px', width: '100%' }}
            >
                <div className="card-body text-center p-4">
                    <h1 className="text-danger mb-3">Admin Panel Error</h1>

                    <p className="text-muted mb-4">
                        Something went wrong with the admin panel. This could be
                        due to:
                    </p>

                    <ul className="text-start text-muted mb-4 ps-3">
                        <li>Database connection issues</li>
                        <li>Authentication problems</li>
                        <li>Network connectivity</li>
                        <li>Server configuration</li>
                    </ul>

                    <div className="d-flex gap-3 justify-content-center">
                        <button
                            onClick={handleRetry}
                            className="btn btn-primary"
                        >
                            Try Again
                        </button>

                        <button
                            onClick={handleGoHome}
                            className="btn btn-success"
                        >
                            Go to Main Site
                        </button>
                    </div>

                    {process.env.NODE_ENV === 'development' && error && (
                        <details className="mt-4">
                            <summary className="fw-bold cursor-pointer">
                                Error Details (Development)
                            </summary>
                            <pre className="mt-2 text-danger small bg-light p-2 rounded">
                                {error.toString()}
                            </pre>
                        </details>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ErrorBoundary;
