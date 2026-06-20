import React, { useState, useEffect } from 'react';
import '../Categories/CategoryManager.css';
import './MenuItemManager.css';

const ITEMS_PER_PAGE = 6;

const MenuItemManager = ({ categories, items, setItems }) => {
  const emptyForm = {
    id: null,
    item_name: '',
    category_id: '',
    business_id: '',
    price: '',
    tax_percentage: '',
    discount: '',
    photo: '',
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fav_menu_items')) || [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('fav_menu_items', JSON.stringify(favorites));
  }, [favorites]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.item_name.trim()) e.item_name = 'Item name is required.';
    if (!form.category_id) e.category_id = 'Category is required.';
    if (!form.price) e.price = 'Price is required.';
    else if (isNaN(form.price) || Number(form.price) <= 0)
      e.price = 'Price must be a positive number.';
    if (form.tax_percentage !== '') {
      if (isNaN(form.tax_percentage) || Number(form.tax_percentage) < 0 || Number(form.tax_percentage) > 100)
        e.tax_percentage = 'Tax must be between 0 and 100.';
    }
    if (form.discount !== '') {
      if (isNaN(form.discount) || Number(form.discount) < 0)
        e.discount = 'Discount must be 0 or more.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (form.id) {
      setItems((prev) => prev.map((i) => (i.id === form.id ? { ...form } : i)));
    } else {
      setItems((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    }
    setForm(emptyForm);
    setEditingId(null);
    setErrors({});
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setErrors({});
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this menu item?')) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (editingId === id) handleCancel();
    }
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Filter
  const filtered = items.filter((item) => {
    const matchSearch = item.item_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchCat = filterCategory
      ? item.category_id === filterCategory
      : true;
    return matchSearch && matchCat;
  });

  // Group by category for display
  const grouped = categories.reduce((acc, cat) => {
    const catItems = filtered.filter((i) => i.category_id === cat.id);
    if (catItems.length > 0) acc[cat.id] = { name: cat.name, items: catItems };
    return acc;
  }, {});
  const ungrouped = filtered.filter(
    (i) => !categories.find((c) => c.id === i.category_id)
  );

  // Pagination on flat filtered list
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const getCatName = (id) =>
    categories.find((c) => c.id === id)?.name || 'Uncategorized';

  return (
    <div className="module-card">
      {/* ── Header ── */}
      <div className="module-header">
        <h2>🍜 Menu Items</h2>
        <span className="badge-count">{items.length} total</span>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="module-form" noValidate>
        <h3>{editingId ? '✏️ Edit Item' : '➕ Add Menu Item'}</h3>

        <div className="form-grid-2">
          <div className="form-group">
            <label>Item Name *</label>
            <input
              type="text"
              value={form.item_name}
              onChange={set('item_name')}
              placeholder="e.g. Tibs"
              className={errors.item_name ? 'input-error' : ''}
            />
            {errors.item_name && <span className="field-error">{errors.item_name}</span>}
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              value={form.category_id}
              onChange={set('category_id')}
              className={errors.category_id ? 'input-error' : ''}
            >
              <option value="">Select category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.category_id && <span className="field-error">{errors.category_id}</span>}
          </div>

          <div className="form-group">
            <label>Price (ETB) *</label>
            <input
              type="number"
              value={form.price}
              onChange={set('price')}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={errors.price ? 'input-error' : ''}
            />
            {errors.price && <span className="field-error">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label>Business ID <span className="optional">(optional)</span></label>
            <input
              type="text"
              value={form.business_id}
              onChange={set('business_id')}
              placeholder="e.g. BIZ-001"
            />
          </div>

          <div className="form-group">
            <label>Tax % <span className="optional">(optional)</span></label>
            <input
              type="number"
              value={form.tax_percentage}
              onChange={set('tax_percentage')}
              placeholder="0 – 100"
              min="0"
              max="100"
              className={errors.tax_percentage ? 'input-error' : ''}
            />
            {errors.tax_percentage && <span className="field-error">{errors.tax_percentage}</span>}
          </div>

          <div className="form-group">
            <label>Discount (ETB) <span className="optional">(optional)</span></label>
            <input
              type="number"
              value={form.discount}
              onChange={set('discount')}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={errors.discount ? 'input-error' : ''}
            />
            {errors.discount && <span className="field-error">{errors.discount}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Photo URL <span className="optional">(optional)</span></label>
          <input
            type="text"
            value={form.photo}
            onChange={set('photo')}
            placeholder="https://..."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update Item' : 'Add Item'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-ghost" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr className="divider" />

      {/* ── Search & Filter ── */}
      <div className="filter-row">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by item name..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* ── Items Grid ── */}
      {paged.length === 0 ? (
        <div className="empty-state">
          {items.length === 0
            ? 'No items yet. Add one above.'
            : 'No items match your search.'}
        </div>
      ) : (
        <div className="items-grid">
          {paged.map((item) => {
            const isFav = favorites.includes(item.id);
            const finalPrice =
              Number(item.price) *
              (1 + (Number(item.tax_percentage) || 0) / 100) -
              (Number(item.discount) || 0);
            return (
              <div key={item.id} className={`item-card ${editingId === item.id ? 'card-editing' : ''}`}>
                {item.photo ? (
                  <img src={item.photo} alt={item.item_name} className="card-img" />
                ) : (
                  <div className="card-img-placeholder">🍽️</div>
                )}
                <div className="card-body">
                  <div className="card-top">
                    <h4>{item.item_name}</h4>
                    <button
                      className={`fav-btn ${isFav ? 'fav-active' : ''}`}
                      onClick={() => toggleFavorite(item.id)}
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {isFav ? '❤️' : '🤍'}
                    </button>
                  </div>
                  <span className="cat-badge">{getCatName(item.category_id)}</span>
                  <div className="price-row">
                    <span className="price">ETB {Number(item.price).toFixed(2)}</span>
                    {item.tax_percentage && (
                      <span className="tax">+{item.tax_percentage}% tax</span>
                    )}
                  </div>
                  {item.discount && Number(item.discount) > 0 && (
                    <p className="discount-text">− ETB {Number(item.discount).toFixed(2)} discount</p>
                  )}
                  <p className="final-price">Final: ETB {finalPrice.toFixed(2)}</p>
                  <div className="card-actions">
                    <button className="btn btn-sm btn-warning" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
          <span>Page {safePage} of {totalPages}</span>
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

export default MenuItemManager;
