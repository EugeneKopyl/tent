import { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

function AdminWorksTab({ userRole }) {
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({});
    const [changed, setChanged] = useState(false);
    const [error, setError] = useState('');
    const [creating, setCreating] = useState(false);
    const [newWork, setNewWork] = useState({
        title: '',
        image: '',
    });
    const [compressionOptions, setCompressionOptions] = useState({
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    });
    // const [showCompressionSettings, setShowCompressionSettings] =
    //     useState(false);

    useEffect(() => {
        fetchWorks();
    }, []);

    async function fetchWorks() {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/works');
            if (!res.ok) {
                setError('Ошибка загрузки работ');
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
            setWorks(data || []);
        } catch (e) {
            setError('Ошибка загрузки работ');
            console.error('Error fetching works:', e);
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
                (k) => updated[k] !== works.find((w) => w._id === editId)[k],
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
            const res = await fetch('/api/works', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                setError(errorData.message || 'Ошибка сохранения');
                console.error('Error saving work:', errorData);
                return;
            }
            await fetchWorks();
            setEditId(null);
            setEditData({});
            setChanged(false);
            setError('');
        } catch (e) {
            setError('Ошибка сохранения работы');
            console.error('Error saving work:', e);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Удалить эту работу?')) return;
        try {
            const res = await fetch('/api/works', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: id }),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                setError(errorData.message || 'Ошибка удаления');
                console.error('Error deleting work:', errorData);
                return;
            }
            await fetchWorks();
            setError('');
        } catch (e) {
            setError('Ошибка удаления работы');
            console.error('Error deleting work:', e);
        }
    }

    function renderImage(image) {
        if (!image) return null;
        if (image.startsWith('/images/') || image.startsWith('data:image/')) {
            return (
                <img
                    src={image}
                    alt=""
                    style={{ width: 100, height: 100, objectFit: 'cover' }}
                />
            );
        }
        return null;
    }

    const handleNewField = (field, value) =>
        setNewWork({ ...newWork, [field]: value });

    async function compressImage(file) {
        try {
            const compressedFile = await imageCompression(
                file,
                compressionOptions,
            );
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(compressedFile);
            });
        } catch (error) {
            console.error('Error compressing image:', error);
            throw error;
        }
    }

    async function handleFileChange(e, callback) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Пожалуйста, выберите файл изображения');
            return;
        }

        try {
            setError('Сжатие изображения...');
            const compressedDataUrl = await compressImage(file);
            callback(compressedDataUrl);
            setError('');
        } catch (error) {
            setError('Ошибка обработки изображения: ' + error.message);
            console.error('Error processing image:', error);
        }
    }

    async function handleCreate() {
        if (!newWork.title.trim() || !newWork.image) {
            setError('Заполните название и загрузите изображение');
            return;
        }
        try {
            const res = await fetch('/api/works', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newWork),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                setError(errorData.message || 'Ошибка создания');
                console.error('Error creating work:', errorData);
                return;
            }
            setNewWork({ title: '', image: '' });
            setCreating(false);
            setError('');
            await fetchWorks();
        } catch (e) {
            setError('Ошибка создания работы');
            console.error('Error creating work:', e);
        }
    }

    return (
        <div>
            {/* настройки сжатия */}
            {/*<div className="mb-3">*/}
            {/*    <button*/}
            {/*        className="btn btn-sm btn-outline-secondary me-2"*/}
            {/*        onClick={() =>*/}
            {/*            setShowCompressionSettings(!showCompressionSettings)*/}
            {/*        }*/}
            {/*    >*/}
            {/*        {showCompressionSettings*/}
            {/*            ? 'Скрыть настройки сжатия'*/}
            {/*            : 'Показать настройки сжатия'}*/}
            {/*    </button>*/}
            {/*</div>*/}

            {/*{showCompressionSettings && (*/}
            {/*    <div className="card mb-3 p-3 bg-light">*/}
            {/*        <h6>Настройки оптимизации изображений</h6>*/}
            {/*        <div className="row g-2">*/}
            {/*            <div className="col-md-6">*/}
            {/*                <label className="form-label">*/}
            {/*                    Максимальный размер (МБ):*/}
            {/*                </label>*/}
            {/*                <input*/}
            {/*                    type="number"*/}
            {/*                    className="form-control form-control-sm"*/}
            {/*                    min="0.1"*/}
            {/*                    max="10"*/}
            {/*                    step="0.1"*/}
            {/*                    value={compressionOptions.maxSizeMB}*/}
            {/*                    onChange={(e) =>*/}
            {/*                        setCompressionOptions({*/}
            {/*                            ...compressionOptions,*/}
            {/*                            maxSizeMB: parseFloat(e.target.value),*/}
            {/*                        })*/}
            {/*                    }*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*            <div className="col-md-6">*/}
            {/*                <label className="form-label">*/}
            {/*                    Максимальное разрешение (px):*/}
            {/*                </label>*/}
            {/*                <input*/}
            {/*                    type="number"*/}
            {/*                    className="form-control form-control-sm"*/}
            {/*                    min="100"*/}
            {/*                    max="4000"*/}
            {/*                    step="100"*/}
            {/*                    value={compressionOptions.maxWidthOrHeight}*/}
            {/*                    onChange={(e) =>*/}
            {/*                        setCompressionOptions({*/}
            {/*                            ...compressionOptions,*/}
            {/*                            maxWidthOrHeight: parseInt(*/}
            {/*                                e.target.value,*/}
            {/*                            ),*/}
            {/*                        })*/}
            {/*                    }*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <small className="text-muted">*/}
            {/*            Изображения будут автоматически сжаты перед сохранением*/}
            {/*        </small>*/}
            {/*    </div>*/}
            {/*)}*/}

            <div className="mb-3 text-end">
                {creating ? (
                    <>
                        <button
                            className="btn btn-secondary me-2"
                            onClick={() => {
                                setCreating(false);
                                setNewWork({ title: '', image: '' });
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
                        + Добавить
                    </button>
                )}
            </div>

            {creating && (
                <div className="card mb-3 p-3 bg-light">
                    <div className="row align-items-center g-2">
                        <div className="col-12 col-md-6 mb-2 mb-md-0">
                            <input
                                className="form-control"
                                value={newWork.title}
                                onChange={(e) =>
                                    handleNewField('title', e.target.value)
                                }
                                placeholder="Название работы"
                            />
                        </div>
                        <div className="col-12 col-md-6 d-flex align-items-center">
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
                            {newWork.image && (
                                <div className="ms-2">
                                    {renderImage(newWork.image)}
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
                                <th>Изображение</th>
                                <th>Дата добавления</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {works.map((item, idx) => (
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
                                    <td>
                                        {editId === item._id ? (
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="file"
                                                    className="form-control p-1"
                                                    accept="image/*"
                                                    style={{
                                                        fontSize: 12,
                                                        maxWidth: 150,
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
                                    <td>
                                        {item.createdAt
                                            ? new Date(
                                                  item.createdAt,
                                              ).toLocaleDateString('ru-RU', {
                                                  year: 'numeric',
                                                  month: 'short',
                                                  day: 'numeric',
                                              })
                                            : '-'}
                                    </td>
                                    <td style={{ width: 150 }}>
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

export default AdminWorksTab;
