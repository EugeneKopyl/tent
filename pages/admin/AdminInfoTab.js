import { useState } from 'react';

function AdminInfoTab({ users, error, formatDate, loading, userRole }) {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });
    const [newPassword, setNewPassword] = useState('');
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/admin/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                setFormSuccess('Admin created successfully!');
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                });
                setTimeout(() => {
                    setShowRegisterModal(false);
                    window.location.reload();
                }, 1500);
            } else {
                setFormError(data.message || 'Failed to create admin');
            }
        } catch (error) {
            setFormError('Network error. Please try again.');
            console.error('Registration error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedUser) return;

        setIsSubmitting(true);
        setFormError('');

        try {
            const response = await fetch('/api/admin/deleteUser', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: selectedUser._id }),
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                setShowDeleteModal(false);
                setSelectedUser(null);
                window.location.reload();
            } else {
                setFormError(data.message || 'Failed to delete admin');
            }
        } catch (error) {
            setFormError('Network error. Please try again.');
            console.error('Delete user error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePasswordChangeSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser) return;

        setFormError('');
        setFormSuccess('');
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/admin/changePassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: selectedUser._id, newPassword }),
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                setFormSuccess('Password changed successfully!');
                setNewPassword('');
                setTimeout(() => {
                    setShowPasswordModal(false);
                    setSelectedUser(null);
                }, 1500);
            } else {
                setFormError(data.message || 'Failed to change password');
            }
        } catch (error) {
            setFormError('Network error. Please try again.');
            console.error('Change password error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
        setFormError('');
    };

    const openPasswordModal = (user) => {
        setSelectedUser(user);
        setShowPasswordModal(true);
        setFormError('');
        setFormSuccess('');
        setNewPassword('');
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
                <div className="card shadow-sm">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h2 className="h5 mb-0">User Database</h2>
                        {userRole === 'superadmin' && (
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => setShowRegisterModal(true)}
                            >
                                + Add Admin
                            </button>
                        )}
                    </div>
                    <div className="card-body">
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}
                        {users?.length === 0 ? (
                            <div className="text-center py-5">
                                <p className="text-muted">
                                    No users found in the database.
                                </p>
                                <p className="text-muted">
                                    Users will appear here once they register.
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
                                            {userRole === 'superadmin' && (
                                                <th>Actions</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users?.map((user) => (
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
                                                        className={`badge ${user.role === 'superadmin' ? 'bg-danger' : user.role === 'admin' ? 'bg-success' : 'bg-info'}`}
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
                                                    {formatDate(user.createdAt)}
                                                </td>
                                                <td>
                                                    {formatDate(user.lastLogin)}
                                                </td>
                                                {userRole === 'superadmin' && (
                                                    <td>
                                                        {user.role !==
                                                        'superadmin' ? (
                                                            <div
                                                                className="btn-group btn-group-sm"
                                                                role="group"
                                                            >
                                                                <button
                                                                    className="btn btn-outline-primary"
                                                                    onClick={() =>
                                                                        openPasswordModal(
                                                                            user,
                                                                        )
                                                                    }
                                                                    title="Change Password"
                                                                >
                                                                    🔑
                                                                </button>
                                                                <button
                                                                    className="btn btn-outline-danger"
                                                                    onClick={() =>
                                                                        openDeleteModal(
                                                                            user,
                                                                        )
                                                                    }
                                                                    title="Delete Admin"
                                                                >
                                                                    🗑️
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted small">
                                                                Protected
                                                            </span>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showRegisterModal && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Register New Admin
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowRegisterModal(false)}
                                    disabled={isSubmitting}
                                ></button>
                            </div>
                            <form onSubmit={handleRegisterSubmit}>
                                <div className="modal-body">
                                    {formError && (
                                        <div
                                            className="alert alert-danger"
                                            role="alert"
                                        >
                                            {formError}
                                        </div>
                                    )}
                                    {formSuccess && (
                                        <div
                                            className="alert alert-success"
                                            role="alert"
                                        >
                                            {formSuccess}
                                        </div>
                                    )}
                                    <div className="mb-3">
                                        <label
                                            htmlFor="username"
                                            className="form-label"
                                        >
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            value={formData.username}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    username: e.target.value,
                                                })
                                            }
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="email"
                                            className="form-label"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    email: e.target.value,
                                                })
                                            }
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="firstName"
                                            className="form-label"
                                        >
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    firstName: e.target.value,
                                                })
                                            }
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="lastName"
                                            className="form-label"
                                        >
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    lastName: e.target.value,
                                                })
                                            }
                                            required
                                            disabled={isSubmitting}
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
                                            className="form-control"
                                            id="password"
                                            value={formData.password}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    password: e.target.value,
                                                })
                                            }
                                            required
                                            minLength="6"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            setShowRegisterModal(false)
                                        }
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? 'Creating...'
                                            : 'Create Admin'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && selectedUser && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedUser(null);
                                    }}
                                    disabled={isSubmitting}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {formError && (
                                    <div
                                        className="alert alert-danger"
                                        role="alert"
                                    >
                                        {formError}
                                    </div>
                                )}
                                <p>
                                    Are you sure you want to delete admin{' '}
                                    <strong>{selectedUser.username}</strong>?
                                </p>
                                <p className="text-danger">
                                    This action cannot be undone!
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedUser(null);
                                    }}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDeleteConfirm}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showPasswordModal && selectedUser && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Change Password</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setSelectedUser(null);
                                    }}
                                    disabled={isSubmitting}
                                ></button>
                            </div>
                            <form onSubmit={handlePasswordChangeSubmit}>
                                <div className="modal-body">
                                    {formError && (
                                        <div
                                            className="alert alert-danger"
                                            role="alert"
                                        >
                                            {formError}
                                        </div>
                                    )}
                                    {formSuccess && (
                                        <div
                                            className="alert alert-success"
                                            role="alert"
                                        >
                                            {formSuccess}
                                        </div>
                                    )}
                                    <p>
                                        Change password for admin{' '}
                                        <strong>{selectedUser.username}</strong>
                                    </p>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="newPassword"
                                            className="form-label"
                                        >
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="newPassword"
                                            value={newPassword}
                                            onChange={(e) =>
                                                setNewPassword(e.target.value)
                                            }
                                            required
                                            minLength="6"
                                            disabled={isSubmitting}
                                            placeholder="Enter new password (min 6 characters)"
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowPasswordModal(false);
                                            setSelectedUser(null);
                                        }}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? 'Changing...'
                                            : 'Change Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminInfoTab;
