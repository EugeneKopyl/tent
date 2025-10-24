import { useRouter } from 'next/router';

function Error({ statusCode }) {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="d-flex align-items-center justify-content-center p-4 bg-light flex-grow-1">
      <div className="card shadow-sm" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-body text-center p-4">
          <h1 className="text-danger mb-3">
            {statusCode ? `Error ${statusCode}` : 'An Error Occurred'}
          </h1>
          
          <p className="text-muted mb-4">
            {statusCode === 404 
              ? 'The page you are looking for could not be found.'
              : 'Something went wrong. This could be due to server issues or network problems.'
            }
          </p>

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

          {statusCode === 500 && (
            <div className="mt-4 p-3 bg-light rounded">
              <p className="fw-bold mb-2">Server Error</p>
              <p className="small text-muted mb-2">If this problem persists, please check:</p>
              <ul className="text-start small text-muted">
                <li>Database connection</li>
                <li>Environment variables</li>
                <li>Server logs</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
