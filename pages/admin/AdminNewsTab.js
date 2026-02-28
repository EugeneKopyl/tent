import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import imageCompression from 'browser-image-compression';
import { generateSlug } from '@/lib/helpers';

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <div className="p-3">Загрузка редактора...</div>,
});

function AdminNewsTab() {
    const [news, setNews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({});
    const [error, setError] = useState('');
    const [creating, setCreating] = useState(false);
    const [newNews, setNewNews] = useState({
        title: '',
        shortDescription: '',
        content: '',
        previewImage: '',
        category: '',
        published: false,
    });
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [cacheMsg, setCacheMsg] = useState('');
    const [cacheLoading, setCacheLoading] = useState(false);
    const [categoryForm, setCategoryForm] = useState({
        name: '',
        description: '',
    });
    const [compressionOptions, setCompressionOptions] = useState({
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    });
    const formRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        fetchNews();
        fetchCategories();

        const style = document.createElement('style');
        style.textContent = `
            .news-content-preview img {
                max-width: 100% !important;
                height: auto !important;
                display: block;
                margin: 1rem 0;
            }
            .news-content-preview {
                overflow-wrap: break-word;
                word-wrap: break-word;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    async function fetchNews() {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/news?preview=true');
            if (!res.ok) {
                setError('Ошибка загрузки новостей');
                console.error(`HTTP error! status: ${res.status}`);
                setLoading(false);
                return;
            }
            let data = await res.json();
            if (Array.isArray(data)) {
                data = data.slice().sort((a, b) => {
                    const dateA = a.publishedAt || a.createdAt || new Date(0);
                    const dateB = b.publishedAt || b.createdAt || new Date(0);
                    return new Date(dateB) - new Date(dateA);
                });
            }
            setNews(data || []);
        } catch (e) {
            setError('Ошибка загрузки новостей');
            console.error('Error fetching news:', e);
        }
        setLoading(false);
    }

    async function fetchCategories() {
        try {
            const res = await fetch('/api/news-categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data || []);
            }
        } catch (e) {
            console.error('Error fetching categories:', e);
        }
    }

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditData(item);
        setError('');
        setNewNews({
            title: item.title || '',
            shortDescription: item.shortDescription || '',
            content: item.content || '',
            previewImage: item.previewImage || '',
            category:
                typeof item.category === 'object'
                    ? item.category._id
                    : item.category || '',
            published: item.published || false,
        });
        setCreating(true);
        setTimeout(() => {
            if (formRef.current) {
                formRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        }, 100);
    };

    const handleContentChange = (content) => {
        setNewNews({ ...newNews, content });
    };

    async function handleDelete(id) {
        if (!window.confirm('Удалить эту новость?')) return;
        try {
            const res = await fetch('/api/news', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: id }),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                setError(errorData.message || 'Ошибка удаления');
                console.error('Error deleting news:', errorData);
                return;
            }
            await fetchNews();
            setError('');
        } catch (e) {
            setError('Ошибка удаления новости');
            console.error('Error deleting news:', e);
        }
    }

    function renderImage(image) {
        if (!image) return null;
        if (image.startsWith('/images/') || image.startsWith('data:image/')) {
            return (
                <img
                    src={image}
                    alt="Preview"
                    style={{
                        width: 100,
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: '4px',
                    }}
                />
            );
        }
        return null;
    }

    const handleNewField = (field, value) =>
        setNewNews({ ...newNews, [field]: value });

    async function handleCreate() {
        if (
            !newNews.title.trim() ||
            !newNews.content.trim() ||
            !newNews.category
        ) {
            setError('Заполните заголовок, содержимое и выберите категорию');
            return;
        }
        try {
            const dataToSave = {
                ...newNews,
                category:
                    typeof newNews.category === 'object'
                        ? newNews.category._id
                        : newNews.category,
            };

            if (editId) {
                dataToSave._id = editId;
                const res = await fetch('/api/news', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSave),
                });
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    setError(errorData.message || 'Ошибка сохранения');
                    console.error('Error saving news:', errorData);
                    return;
                }
            } else {
                const res = await fetch('/api/news', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSave),
                });
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    setError(errorData.message || 'Ошибка создания');
                    console.error('Error creating news:', errorData);
                    return;
                }
            }

            setNewNews({
                title: '',
                shortDescription: '',
                content: '',
                previewImage: '',
                category: '',
                published: false,
            });
            setCreating(false);
            setEditId(null);
            setEditData({});
            setError('');
            await fetchNews();
        } catch (e) {
            setError(
                editId
                    ? 'Ошибка сохранения новости'
                    : 'Ошибка создания новости',
            );
            console.error('Error saving news:', e);
        }
    }

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

    async function handleFileChange(e, cb) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Пожалуйста, выберите файл изображения');
            return;
        }

        try {
            setError('Сжатие изображения...');
            const compressedDataUrl = await compressImage(file);
            cb(compressedDataUrl);
            setError('');
        } catch (error) {
            setError('Ошибка обработки изображения: ' + error.message);
            console.error('Error processing image:', error);
        }
    }

    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                setError('Пожалуйста, выберите файл изображения');
                return;
            }

            try {
                setError('Сжатие изображения...');
                const compressedDataUrl = await compressImage(file);

                const editorElement = document
                    .querySelector('.ql-editor')
                    ?.closest('.quill');
                if (editorElement && editorElement.__quill) {
                    const quill = editorElement.__quill;
                    const range = quill.getSelection(true);
                    const index = range ? range.index : quill.getLength();
                    quill.insertEmbed(index, 'image', compressedDataUrl);
                    quill.setSelection(index + 1);
                    setTimeout(() => {
                        handleContentChange(quill.root.innerHTML);
                    }, 0);
                } else {
                    const currentContent = newNews.content || '';
                    const imgTag = `<img src="${compressedDataUrl}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`;
                    handleContentChange(currentContent + imgTag);
                }
                setError('');
            } catch (error) {
                setError('Ошибка обработки изображения: ' + error.message);
                console.error('Error processing image:', error);
            }
        };
    };

    const quillModules = {
        toolbar: {
            container: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ indent: '-1' }, { indent: '+1' }],
                [{ size: ['small', false, 'large', 'huge'] }],
                [{ color: [] }, { background: [] }],
                [{ align: [] }],
                ['link', 'image'],
                ['clean'],
            ],
            handlers: {
                image: imageHandler,
            },
        },
    };

    const quillFormats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'list',
        'bullet',
        'indent',
        'size',
        'color',
        'background',
        'align',
        'link',
        'image',
    ];

    async function handleCreateCategory() {
        if (!categoryForm.name.trim()) {
            setError('Введите название категории');
            return;
        }
        try {
            const res = await fetch('/api/news-categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoryForm),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                setError(errorData.message || 'Ошибка создания категории');
                return;
            }
            setCategoryForm({ name: '', description: '' });
            setShowCategoryModal(false);
            await fetchCategories();
        } catch (e) {
            setError('Ошибка создания категории');
            console.error('Error creating category:', e);
        }
    }

    async function handleDeleteCategory(id) {
        if (
            !window.confirm(
                'Удалить эту категорию? Новости с этой категорией не будут удалены.',
            )
        )
            return;
        try {
            const res = await fetch('/api/news-categories', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: id }),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                setError(errorData.message || 'Ошибка удаления категории');
                return;
            }
            await fetchCategories();
        } catch (e) {
            setError('Ошибка удаления категории');
            console.error('Error deleting category:', e);
        }
    }

    const handlePreview = (item) => {
        // Генерируем slug, если его нет
        const slug = item.slug || generateSlug(item.title);
        const previewUrl = `/news/${slug}?preview=true`;
        window.open(previewUrl, '_blank', 'noopener,noreferrer');
    };

    const refreshCache = async () => {
        setCacheLoading(true);
        setCacheMsg('');
        try {
            const res = await fetch('/api/cache/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'news' }),
            });
            const data = await res.json();
            setCacheMsg(res.ok ? 'Кэш обновлён' : `Ошибка: ${data.message}`);
        } catch (e) {
            setCacheMsg('Ошибка сети');
        }
        setCacheLoading(false);
    };

    return (
        <div>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h4>Управление новостями</h4>
                <div className="d-flex gap-2 align-items-center">
                    <button
                        className="btn btn-info btn-sm"
                        onClick={() => setShowCategoryModal(true)}
                    >
                        Управление категориями
                    </button>
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={refreshCache}
                        disabled={cacheLoading}
                        title="Очистить кэш и принудительно обновить при следующем запросе"
                    >
                        {cacheLoading ? '...' : 'Обновить кэш'}
                    </button>
                    {cacheMsg && (
                        <span
                            className="small"
                            style={{
                                color: cacheMsg.includes('Ошибка')
                                    ? '#dc3545'
                                    : '#28a745',
                            }}
                        >
                            {cacheMsg}
                        </span>
                    )}
                    {creating ? (
                        <>
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => {
                                    setCreating(false);
                                    setEditId(null);
                                    setEditData({});
                                    setNewNews({
                                        title: '',
                                        shortDescription: '',
                                        content: '',
                                        previewImage: '',
                                        category: '',
                                        published: false,
                                    });
                                    setError('');
                                }}
                            >
                                Отмена
                            </button>
                            <button
                                className="btn btn-success btn-sm"
                                onClick={handleCreate}
                            >
                                {editId ? 'Сохранить изменения' : 'Сохранить'}
                            </button>
                        </>
                    ) : (
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                                setEditId(null);
                                setEditData({});
                                setCreating(true);
                                setError('');
                            }}
                        >
                            + Новая новость
                        </button>
                    )}
                </div>
            </div>

            {showCategoryModal && (
                <div
                    className="modal show d-block"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onClick={() => setShowCategoryModal(false)}
                >
                    <div
                        className="modal-dialog"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Управление категориями
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowCategoryModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">
                                        Новая категория
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Название категории"
                                        value={categoryForm.name}
                                        onChange={(e) =>
                                            setCategoryForm({
                                                ...categoryForm,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Описание (необязательно)"
                                        value={categoryForm.description}
                                        onChange={(e) =>
                                            setCategoryForm({
                                                ...categoryForm,
                                                description: e.target.value,
                                            })
                                        }
                                    />
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={handleCreateCategory}
                                    >
                                        Создать категорию
                                    </button>
                                </div>
                                <hr />
                                <div>
                                    <strong>Существующие категории:</strong>
                                    {categories.length === 0 ? (
                                        <p className="text-muted">
                                            Категорий пока нет
                                        </p>
                                    ) : (
                                        <ul className="list-group mt-2">
                                            {categories.map((cat) => (
                                                <li
                                                    key={cat._id}
                                                    className="list-group-item d-flex justify-content-between align-items-center"
                                                >
                                                    <div>
                                                        <strong>
                                                            {cat.name}
                                                        </strong>
                                                        {cat.description && (
                                                            <div className="text-muted small">
                                                                {
                                                                    cat.description
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() =>
                                                            handleDeleteCategory(
                                                                cat._id,
                                                            )
                                                        }
                                                    >
                                                        Удалить
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {creating && (
                <div ref={formRef} className="card mb-3 p-3 bg-light">
                    <h5 className="mb-3">
                        {editId ? 'Редактирование новости' : 'Создание новости'}
                    </h5>
                    <div className="mb-3">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={newNews.published}
                                onChange={(e) =>
                                    handleNewField(
                                        'published',
                                        e.target.checked,
                                    )
                                }
                            />
                            <label className="form-check-label">
                                Опубликовать
                            </label>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Заголовок *</label>
                        <input
                            className="form-control"
                            value={newNews.title}
                            onChange={(e) =>
                                handleNewField('title', e.target.value)
                            }
                            placeholder="Заголовок новости"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Краткое описание</label>
                        <textarea
                            className="form-control"
                            value={newNews.shortDescription}
                            onChange={(e) =>
                                handleNewField(
                                    'shortDescription',
                                    e.target.value,
                                )
                            }
                            placeholder="Краткое описание для карточки"
                            rows="2"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Категория *</label>
                        <select
                            className="form-control"
                            value={
                                typeof newNews.category === 'object'
                                    ? newNews.category._id
                                    : newNews.category
                            }
                            onChange={(e) =>
                                handleNewField('category', e.target.value)
                            }
                        >
                            <option value="">Выберите категорию</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Превью изображение</label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) =>
                                handleFileChange(e, (img) =>
                                    handleNewField('previewImage', img),
                                )
                            }
                        />
                        {newNews.previewImage && (
                            <div className="mt-2">
                                {renderImage(newNews.previewImage)}
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Содержимое *</label>
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={newNews.content}
                            onChange={handleContentChange}
                            modules={quillModules}
                            formats={quillFormats}
                            style={{ height: '400px', marginBottom: '50px' }}
                        />
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
                                <th>Заголовок</th>
                                <th>Категория</th>
                                <th>Превью</th>
                                <th>Опубликована</th>
                                <th>Дата публикации</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {news.map((item, idx) => (
                                <tr key={item._id}>
                                    <td className="align-top">{idx + 1}</td>
                                    <td className="align-top">
                                        <div>
                                            <strong>{item.title}</strong>
                                            {item.shortDescription && (
                                                <div className="text-muted small">
                                                    {item.shortDescription.substring(
                                                        0,
                                                        50,
                                                    )}
                                                    ...
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="align-top">
                                        {item.category?.name || '-'}
                                    </td>
                                    <td className="align-top">
                                        {renderImage(item.previewImage)}
                                    </td>
                                    <td className="align-top">
                                        {item.published ? 'Да' : 'Нет'}
                                    </td>
                                    <td className="align-top">
                                        {item.publishedAt
                                            ? new Date(
                                                  item.publishedAt,
                                              ).toLocaleDateString('ru-RU')
                                            : '-'}
                                    </td>
                                    <td
                                        style={{ width: 200 }}
                                        className="align-top"
                                    >
                                        <div className="d-flex flex-column gap-2">
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => handleEdit(item)}
                                            >
                                                Редактировать
                                            </button>
                                            <button
                                                className="btn btn-info btn-sm"
                                                onClick={() =>
                                                    handlePreview(item)
                                                }
                                            >
                                                Превью
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                    handleDelete(item._id)
                                                }
                                            >
                                                Удалить
                                            </button>
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

export default AdminNewsTab;
