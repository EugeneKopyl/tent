import ErrorBoundary from '../../components/ErrorBoundary';
import AdminPartsTab from './AdminPartsTab';
import AdminInfoTab from './AdminInfoTab';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function AdminDashboardLayout() {
    const [tab, setTab] = useState('parts');
    const [users, setUsers] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        async function fetchRole() {
            try {
                const res = await fetch('/api/admin/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (res.ok) {
                    const data = await res.json();
                    setUserRole(data.role);
                    if (data.role === 'superadmin') {
                        setTab('admin');
                    }
                }
            } catch (e) {
                console.error('Error fetching role:', e);
            }
        }
        fetchRole();
    }, []);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const response = await fetch('/api/admin/users', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (response.ok) {
                setUsers(data.users || []);
                setError('');
            } else {
                setError(data.message || 'Failed to fetch users');
            }
        } catch (error) {
            setError('Unable to fetch users.');
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        if (tab === 'admin' && userRole === 'superadmin') {
            fetchUsers();
        }
    }, [tab, userRole]);

    const formatDate = (d) => {
        if (!d) return 'Never';
        return new Date(d).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (e) {
            console.error('Error during logout:', e);
        }
        router.push('/admin/login');
    };

    return (
        <ErrorBoundary>
            <div className="container-fluid p-3 bg-light">
                <div className="d-flex justify-content-end mb-2">
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={handleLogout}
                    >
                        Выйти
                    </button>
                </div>
                <ul className="nav nav-tabs mb-4">
                    {userRole === 'superadmin' && (
                        <li className="nav-item">
                            <button
                                className={`nav-link ${tab === 'admin' ? 'active' : ''}`}
                                onClick={() => setTab('admin')}
                            >
                                Управление пользователями
                            </button>
                        </li>
                    )}
                    <li className="nav-item">
                        <button
                            className={`nav-link ${tab === 'parts' ? 'active' : ''}`}
                            onClick={() => setTab('parts')}
                        >
                            Все запчасти
                        </button>
                    </li>
                </ul>
                <div>
                    {tab === 'admin' && userRole === 'superadmin' && (
                        <AdminInfoTab
                            users={users}
                            error={error}
                            formatDate={formatDate}
                            loading={loadingUsers}
                            userRole={userRole}
                        />
                    )}
                    {tab === 'parts' && <AdminPartsTab userRole={userRole} />}
                </div>
            </div>
        </ErrorBoundary>
    );
}
export default AdminDashboardLayout;
