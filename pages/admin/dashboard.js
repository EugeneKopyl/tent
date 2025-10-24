import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthGuard } from '../../lib/authGuard';
import ErrorBoundary from '../../components/ErrorBoundary';

function AdminDashboardContent() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const { isChecking } = useAuthGuard();

  useEffect(() => {
    if (isChecking) return;
    
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUsers(data.users);
        } else {
          if (response.status === 401) {
            router.push('/admin/login');
          } else {
            setError(data.message || 'Failed to fetch users');
          }
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setError('Unable to connect to server. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router, isChecking]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center bg-light p-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light p-3">
      <div className="container-fluid">
        <div className="card shadow-sm mb-4">
          <div className="card-body d-flex justify-content-between align-items-center">
            <h1 className="h3 mb-0 text-dark">Admin Dashboard</h1>
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-muted text-uppercase small">Total Users</h5>
                <h2 className="text-primary">{users.length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-muted text-uppercase small">Active Users</h5>
                <h2 className="text-success">{users.filter(user => user.isActive).length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-muted text-uppercase small">Admin Users</h5>
                <h2 className="text-info">{users.filter(user => user.role === 'admin').length}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-header">
            <h2 className="h5 mb-0">User Database</h2>
          </div>
          <div className="card-body">
            {users.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">No users found in the database.</p>
                <p className="text-muted">Users will appear here once they register.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Last Login</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="font-monospace small text-muted">{user._id.slice(-8)}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>
                          <span className={`badge ${user.role === 'admin' ? 'bg-success' : 'bg-info'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${user.isActive ? 'bg-success' : 'bg-danger'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>{formatDate(user.lastLogin)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ErrorBoundary>
      <AdminDashboardContent />
    </ErrorBoundary>
  );
}
