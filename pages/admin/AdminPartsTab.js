import { useState, useEffect } from 'react';

function AdminPartsTab({ userRole }) {
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
    const [backupMsg, setBackupMsg] = useState('');
    const [backupLoading, setBackupLoading] = useState(false);
    const [restoreFile, setRestoreFile] = useState(null);

    useEffect(() => {
        fetchParts();
    }, []);

    const doBackup = async () => {
        setBackupLoading(true);
        setBackupMsg('');
        try {
            const res = await fetch('/api/parts-backup?action=backup', {
                method: 'POST',
            });
            const data = await res.json();
            setBackupMsg(
                res.ok
                    ? `Бэкап успешно (${data.count} записей)`
                    : `Ошибка: ${data.message}`,
            );
        } catch (e) {
            setBackupMsg('Ошибка сети');
        }
        setBackupLoading(false);
    };

    const doRestore = async () => {
        if (
            !window.confirm(
                'Восстановить данные из последнего бэкапа? Все текущие данные будут удалены.',
            )
        ) {
            return;
        }
        setBackupLoading(true);
        setBackupMsg('');
        try {
            const res = await fetch('/api/parts-backup?action=restore', {
                method: 'POST',
            });
            const data = await res.json();
            setBackupMsg(
                res.ok
                    ? `Восстановление успешно (${data.count} записей)`
                    : `Ошибка: ${data.message}`,
            );
            if (res.ok) fetchParts();
        } catch (e) {
            setBackupMsg('Ошибка сети');
        }
        setBackupLoading(false);
    };

    const doDownload = async () => {
        setBackupLoading(true);
        setBackupMsg('');
        try {
            const res = await fetch('/api/parts-backup?action=download', {
                method: 'POST',
            });
            if (!res.ok) {
                const data = await res.json();
                setBackupMsg(`Ошибка: ${data.message}`);
                setBackupLoading(false);
                return;
            }
            const data = await res.json();
            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json',
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            a.href = url;
            a.download = `parts-backup-${timestamp}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            setBackupMsg(`Файл скачан (${data.length} записей)`);
        } catch (e) {
            setBackupMsg('Ошибка сети');
        }
        setBackupLoading(false);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.json')) {
            setBackupMsg('Ошибка: выберите JSON файл');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (!Array.isArray(data)) {
                    setBackupMsg('Ошибка: неверный формат файла');
                    return;
                }
                setRestoreFile(data);
                setBackupMsg(
                    `Файл загружен (${data.length} записей). Нажмите "Восстановить из файла" для применения.`,
                );
            } catch (e) {
                setBackupMsg('Ошибка: не удалось прочитать файл');
            }
        };
        reader.readAsText(file);
    };

    const doRestoreFromFile = async () => {
        if (!restoreFile) {
            setBackupMsg('Ошибка: сначала загрузите файл');
            return;
        }

        if (
            !window.confirm(
                `Восстановить данные из файла? Будет восстановлено ${restoreFile.length} записей. Все текущие данные будут удалены.`,
            )
        ) {
            return;
        }

        setBackupLoading(true);
        setBackupMsg('');
        try {
            const res = await fetch('/api/parts-backup?action=upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(restoreFile),
            });
            const data = await res.json();
            setBackupMsg(
                res.ok
                    ? `Восстановление из файла успешно (${data.count} записей)`
                    : `Ошибка: ${data.message}`,
            );
            if (res.ok) {
                fetchParts();
                setRestoreFile(null);
                // Очищаем input
                const fileInput = document.getElementById('backup-file-input');
                if (fileInput) fileInput.value = '';
            }
        } catch (e) {
            setBackupMsg('Ошибка сети');
        }
        setBackupLoading(false);
    };

    async function fetchParts() {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/parts');
            if (!res.ok) {
                setError('Ошибка загрузки запчастей');
                console.error(`HTTP error! status: ${res.status}`);
                setLoading(false);
                return;
            }
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
        } catch (e) {
            setError('Ошибка загрузки запчастей');
            console.error('Error fetching parts:', e);
        }
        setLoading(false);
    }
    const handleEdit = (item) => {
        setEditId(item._id);
        setEditData(item);
        setChanged(false);
        setError('');
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
        setError('');
    };
    async function handleSave() {
        try {
            const res = await fetch('/api/parts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                setError(errorData.message || 'Ошибка сохранения');
                console.error('Error saving part:', errorData);
                return;
            }
            await fetchParts();
            setEditId(null);
            setEditData({});
            setChanged(false);
            setError('');
        } catch (e) {
            setError('Ошибка сохранения запчасти');
            console.error('Error saving part:', e);
        }
    }
    async function handleDelete(id) {
        if (!window.confirm('Удалить эту запчасть?')) return;
        try {
            const res = await fetch('/api/parts', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: id }),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                setError(errorData.message || 'Ошибка удаления');
                console.error('Error deleting part:', errorData);
                return;
            }
            await fetchParts();
            setError('');
        } catch (e) {
            setError('Ошибка удаления запчасти');
            console.error('Error deleting part:', e);
        }
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
            setError('Заполните название и загрузите изображение');
            return;
        }
        try {
            const res = await fetch('/api/parts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPart),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                setError(errorData.message || 'Ошибка создания');
                console.error('Error creating part:', errorData);
                return;
            }
            setNewPart({ title: '', price: 0, currency: 'BYN', image: '' });
            setCreating(false);
            setError('');
            await fetchParts();
        } catch (e) {
            setError('Ошибка создания запчасти');
            console.error('Error creating part:', e);
        }
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
            {userRole === 'superadmin' && (
                <div
                    style={{
                        marginBottom: 16,
                        padding: '12px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px',
                    }}
                >
                    <div style={{ marginBottom: '8px' }}>
                        <strong>Бэкап запчастей:</strong>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            alignItems: 'center',
                            marginBottom: '8px',
                        }}
                    >
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={doBackup}
                            disabled={backupLoading}
                        >
                            Создать бэкап
                        </button>
                        <button
                            className="btn btn-success btn-sm"
                            onClick={doDownload}
                            disabled={backupLoading}
                        >
                            Скачать бэкап
                        </button>
                        <button
                            className="btn btn-warning btn-sm"
                            onClick={doRestore}
                            disabled={backupLoading}
                        >
                            Восстановить из последнего
                        </button>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            alignItems: 'center',
                        }}
                    >
                        <input
                            id="backup-file-input"
                            type="file"
                            accept=".json"
                            onChange={handleFileUpload}
                            disabled={backupLoading}
                            style={{ fontSize: '12px' }}
                        />
                        <button
                            className="btn btn-info btn-sm"
                            onClick={doRestoreFromFile}
                            disabled={backupLoading || !restoreFile}
                        >
                            Восстановить из файла
                        </button>
                    </div>
                    {backupMsg && (
                        <div
                            style={{
                                marginTop: '8px',
                                color: backupMsg.includes('Ошибка')
                                    ? '#dc3545'
                                    : '#28a745',
                            }}
                        >
                            {backupMsg}
                        </div>
                    )}
                </div>
            )}
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
                                setError('');
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
                        onClick={() => {
                            setCreating(true);
                            setError('');
                        }}
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

export default AdminPartsTab;
