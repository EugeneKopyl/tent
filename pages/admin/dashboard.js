import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthGuard } from '@/lib/authGuard';
import ErrorBoundary from '../../components/ErrorBoundary';

function AdminPartsTable() {
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({});
    const [changed, setChanged] = useState(false);
    const [error, setError] = useState('');
    const [creating, setCreating] = useState(false);
    const [newPart, setNewPart] = useState({
        title: '',
        price: 0,
        currency: 'BYN',
        image: '',
    });
    useEffect(() => {
        fetchParts();
    }, []);
    async function fetchParts() {
        setLoading(true);
        try {
            const res = await fetch('/api/parts');
            let data = await res.json();
            if (Array.isArray(data)) {
                data = data.slice().sort((a, b) => {
                    if (b.createdAt && a.createdAt) {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    } else {
                        return b._id.localeCompare(a._id);
                    }
                });
            }
            setParts(data || []);
            setError('');
        } catch (e) {
            setError('Ошибка загрузки запчастей');
        }
        setLoading(false);
    }
    const handleEdit = (item) => {
        setEditId(item._id);
        setEditData(item);
        setChanged(false);
    };
    const handleChange = (field, value) => {
        const updated = { ...editData, [field]: value };
        setEditData(updated);
        setChanged(
            Object.keys(updated).some(
                (k) => updated[k] !== parts.find((p) => p._id === editId)[k],
            ),
        );
    };
    const handleCancel = () => {
        setEditId(null);
        setEditData({});
        setChanged(false);
    };
    async function handleSave() {
        try {
            const res = await fetch('/api/parts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData),
            });
            if (!res.ok) throw new Error();
            await fetchParts();
            setEditId(null);
            setEditData({});
            setChanged(false);
        } catch (e) {}
    }
    async function handleDelete(id) {
        if (!window.confirm('Удалить эту запчасть?')) return;
        try {
            const res = await fetch('/api/parts', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: id }),
            });
            if (!res.ok) throw new Error();
            await fetchParts();
        } catch (e) {}
    }
    function renderImage(image) {
        if (!image) return null;
        if (image.startsWith('/images/') || image.startsWith('data:image/')) {
            return (
                <img
                    src={image}
                    alt=""
                    style={{ width: 50, height: 50, objectFit: 'contain' }}
                />
            );
        }
        return null;
    }
    const handleNewField = (field, value) =>
        setNewPart({ ...newPart, [field]: value });
    async function handleCreate() {
        if (!newPart.title.trim() || !newPart.image) {
            return;
        }
        try {
            const res = await fetch('/api/parts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPart),
            });
            if (!res.ok) throw new Error();
            setNewPart({ title: '', price: 0, currency: 'BYN', image: '' });
            setCreating(false);
            await fetchParts();
        } catch (e) {}
    }
    function handleFileChange(e, cb) {
        const file = e.target.files[0];
        if (file) {
            const reader = new window.FileReader();
            reader.onloadend = () => cb(reader.result);
            reader.readAsDataURL(file);
        }
    }
    return (
        <div>
            <div className="mb-3 text-end">
                {creating ? (
                    <>
                        <button
                            className="btn btn-secondary me-2"
                            onClick={() => {
                                setCreating(false);
                                setNewPart({
                                    title: '',
                                    price: 0,
                                    currency: 'BYN',
                                    image: '',
                                });
                            }}
                        >
                            Отмена
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={handleCreate}
                        >
                            Сохранить
                        </button>
                    </>
                ) : (
                    <button
                        className="btn btn-primary"
                        onClick={() => setCreating(true)}
                    >
                        + Новая запчасть
                    </button>
                )}
            </div>
            {creating && (
                <div className="card mb-3 p-3 bg-light">
                    <div className="row align-items-center g-1">
                        <div className="col-12 col-lg-7 mb-2 mb-lg-0">
                            <input
                                className="form-control"
                                value={newPart.title}
                                onChange={(e) =>
                                    handleNewField('title', e.target.value)
                                }
                                placeholder="Название"
                            />
                        </div>
                        <div className="col-6 col-lg-1 mb-2 mb-lg-0">
                            <input
                                className="form-control"
                                value={newPart.price}
                                onChange={(e) =>
                                    handleNewField('price', e.target.value)
                                }
                                type="number"
                                placeholder="Прайс"
                                style={{ minWidth: 70, maxWidth: 120 }}
                            />
                        </div>
                        <div className="col-6 col-lg-1 mb-2 mb-lg-0">
                            <input
                                className="form-control"
                                value={newPart.currency}
                                onChange={(e) =>
                                    handleNewField('currency', e.target.value)
                                }
                                style={{ minWidth: 60, maxWidth: 90 }}
                            />
                        </div>
                        <div className="col-12 col-lg-3 d-flex align-items-center">
                            <input
                                type="file"
                                className="form-control p-1"
                                accept="image/*"
                                style={{ fontSize: 12 }}
                                onChange={(e) =>
                                    handleFileChange(e, (img) =>
                                        handleNewField('image', img),
                                    )
                                }
                            />
                            {newPart.image && (
                                <div className="ms-2">
                                    {renderImage(newPart.image)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <div className="text-center p-5">Загрузка...</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle small">
                        <thead className="table-light">
                            <tr>
                                <th>№</th>
                                <th>Название</th>
                                <th>Прайс</th>
                                <th>Валюта</th>
                                <th>Картинка</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parts.map((item, idx) => (
                                <tr
                                    key={item._id}
                                    className={
                                        editId === item._id
                                            ? 'table-warning'
                                            : ''
                                    }
                                >
                                    <td>{idx + 1}</td>
                                    <td>
                                        {editId === item._id ? (
                                            <input
                                                className="form-control"
                                                value={editData.title}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'title',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        ) : (
                                            item.title
                                        )}
                                    </td>
                                    <td style={{ width: 90 }}>
                                        {editId === item._id ? (
                                            <input
                                                className="form-control"
                                                type="number"
                                                value={editData.price}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'price',
                                                        e.target.value,
                                                    )
                                                }
                                                style={{
                                                    minWidth: 60,
                                                    maxWidth: 90,
                                                }}
                                            />
                                        ) : (
                                            item.price
                                        )}
                                    </td>
                                    <td style={{ width: 65 }}>
                                        {editId === item._id ? (
                                            <input
                                                className="form-control"
                                                value={editData.currency}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'currency',
                                                        e.target.value,
                                                    )
                                                }
                                                style={{
                                                    minWidth: 45,
                                                    maxWidth: 75,
                                                }}
                                            />
                                        ) : (
                                            item.currency
                                        )}
                                    </td>
                                    <td>
                                        {editId === item._id ? (
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="file"
                                                    className="form-control p-1"
                                                    accept="image/*"
                                                    style={{
                                                        fontSize: 12,
                                                        maxWidth: 105,
                                                    }}
                                                    onChange={(e) =>
                                                        handleFileChange(
                                                            e,
                                                            (img) =>
                                                                handleChange(
                                                                    'image',
                                                                    img,
                                                                ),
                                                        )
                                                    }
                                                />
                                                {editData.image && (
                                                    <div className="ms-2">
                                                        {renderImage(
                                                            editData.image,
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            renderImage(item.image)
                                        )}
                                    </td>
                                    <td style={{ width: 110 }}>
                                        <div className="d-flex flex-row flex-lg-row flex-column gap-2">
                                            {editId === item._id ? (
                                                <>
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        disabled={!changed}
                                                        onClick={handleSave}
                                                    >
                                                        Сохранить
                                                    </button>
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={handleCancel}
                                                    >
                                                        Отмена
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="btn btn-warning btn-sm"
                                                        onClick={() =>
                                                            handleEdit(item)
                                                        }
                                                    >
                                                        Редактировать
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() =>
                                                            handleDelete(
                                                                item._id,
                                                            )
                                                        }
                                                    >
                                                        Удалить
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function AdminDashboardContent() {
    const [tab, setTab] = useState('admin');
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
                setError(
                    'Unable to connect to server. Please check your connection.',
                );
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
            minute: '2-digit',
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
                        <button
                            onClick={handleLogout}
                            className="btn btn-danger"
                        >
                            Logout
                        </button>
                    </div>
                </div>
                <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${tab === 'admin' ? 'active' : ''}`}
                            onClick={() => setTab('admin')}
                        >
                            Информация об админе
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${tab === 'parts' ? 'active' : ''}`}
                            onClick={() => setTab('parts')}
                        >
                            Все запчасти
                        </button>
                    </li>
                </ul>
                {tab === 'admin' && (
                    <>
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}
                        <div className="row mb-4">
                            <div className="col-md-4">
                                <div className="card text-center shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title text-muted text-uppercase small">
                                            Total Users
                                        </h5>
                                        <h2 className="text-primary">
                                            {users.length}
                                        </h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card text-center shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title text-muted text-uppercase small">
                                            Active Users
                                        </h5>
                                        <h2 className="text-success">
                                            {
                                                users.filter(
                                                    (user) => user.isActive,
                                                ).length
                                            }
                                        </h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card text-center shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title text-muted text-uppercase small">
                                            Admin Users
                                        </h5>
                                        <h2 className="text-info">
                                            {
                                                users.filter(
                                                    (user) =>
                                                        user.role === 'admin',
                                                ).length
                                            }
                                        </h2>
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
                                        <p className="text-muted">
                                            No users found in the database.
                                        </p>
                                        <p className="text-muted">
                                            Users will appear here once they
                                            register.
                                        </p>
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
                                                        <td className="font-monospace small text-muted">
                                                            {user._id.slice(-8)}
                                                        </td>
                                                        <td>{user.username}</td>
                                                        <td>{user.email}</td>
                                                        <td>
                                                            {user.firstName}{' '}
                                                            {user.lastName}
                                                        </td>
                                                        <td>
                                                            <span
                                                                className={`badge ${user.role === 'admin' ? 'bg-success' : 'bg-info'}`}
                                                            >
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span
                                                                className={`badge ${user.isActive ? 'bg-success' : 'bg-danger'}`}
                                                            >
                                                                {user.isActive
                                                                    ? 'Active'
                                                                    : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {formatDate(
                                                                user.createdAt,
                                                            )}
                                                        </td>
                                                        <td>
                                                            {formatDate(
                                                                user.lastLogin,
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
                {tab === 'parts' && <AdminPartsTable />}
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
