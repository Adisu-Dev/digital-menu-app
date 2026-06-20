import React, { useState } from 'react';
import './CategoryManager.css';

const ITEMS_PER_PAGE = 4;

const CategoryManager = ({ categories, setCategories }) => {
  const emptyForm = { id: null, name: '', image: '', description: '' };
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Category name is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (form.id) {
      setCategories((prev) => prev.map((c) => (c.id === form.id ? { ...form } : c)));
    } else {
      setCategories((prev) => [
        ...prev,
        { ...form, id: Date.now().toString() },
      ]);
    }
    setForm(emptyForm);
    setEditingId(null);
    setErrors({});
  };

  const handleEdit = (cat) => {
    setForm(cat);
    setEditingId(cat.id);
    setErrors({});
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setErrors({});
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this category?')) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      if (editingId === id) handleCancel();
    }
  };

  // Filter + paginate
  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  return (
    <div className="module-card">
      {/* ── Header ── */}
      <div className="module-header">
        <h2>📂 Menu Categories</h2>
        <span className="badge-count">{categories.length} total</span>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="module-form" noValidate>
        <h3>{editingId ? '✏️ Edit Category' : '➕ Add Category'}</h3>

        <div className="form-group">
          <label>Category Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={set('name')}
            placeholder="e.g. Beverages"
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Image URL <span className="optional">(optional)</span></label>
          <input
            type="text"
            value={form.image}
            onChange={set('image')}
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label>Description <span className="optional">(optional)</span></label>
          <textarea
            value={form.description}
            onChange={set('description')}
            placeholder="Short description..."
            rows={2}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update Category' : 'Add Category'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-ghost" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr className="divider" />

      {/* ── Search ── */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Filter categories..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* ── List ── */}
      {paged.length === 0 ? (
        <div className="empty-state">
          {categories.length === 0
            ? 'No categories yet. Add one above.'
            : 'No categories match your search.'}
        </div>
      ) : (
        <div className="category-list">
          {paged.map((cat) => (
            <div key={cat.id} className={`category-row ${editingId === cat.id ? 'row-editing' : ''}`}>
              <div className="row-left">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="cat-thumb" />
                ) : (
                  <div className="cat-thumb-placeholder">📂</div>
                )}
                <div className="row-info">
                  <strong>{cat.name}</strong>
                  {cat.description && <p>{cat.description}</p>}
                </div>
              </div>
              <div className="row-actions">
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => handleEdit(cat)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(cat.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-sm btn-ghost"
            disabled={safePage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ‹ Prev
          </button>
          <span>
            Page {safePage} of {totalPages}
          </span>
          <button
            className="btn btn-sm btn-ghost"
            disabled={safePage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
