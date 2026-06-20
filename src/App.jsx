import React, { useState } from 'react';
import { AuthProvider, useAuth } from './Context/AuthContext';
import Register from './Component/Auth/Register';
import Login from './Component/Auth/Login';
import CategoryManager from './Component/Categories/CategoryManager';
import MenuItemManager from './Component/MenuItems/MenuItemManager';
import './App.css';

/* ─────────────────────────────────────────
   SVG Icons (inline, no extra dependency)
───────────────────────────────────────── */
const Icon = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  category: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 12h16M4 18h16"/>
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"/>
    </svg>
  ),
  tag: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/>
    </svg>
  ),
  item: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
    </svg>
  ),
};

/* ─────────────────────────────────────────
   Stat Card
───────────────────────────────────────── */
const StatCard = ({ icon, label, value, color }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: color }}>{icon}</div>
    <div className="stat-info">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   Main Dashboard
───────────────────────────────────────── */
const MainApp = () => {
  const { user, logout } = useAuth();
  const [authMode, setAuthMode] = useState('login');
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user) {
    return (
      <div className="auth-page">
        {authMode === 'register' ? (
          <Register switchToLogin={() => setAuthMode('login')} />
        ) : (
          <Login switchToRegister={() => setAuthMode('register')} />
        )}
      </div>
    );
  }

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const navItems = [
    { key: 'dashboard', label: 'Dashboard',       icon: Icon.dashboard },
    { key: 'categories', label: 'Categories',     icon: Icon.category  },
    { key: 'items',      label: 'Menu Items',     icon: Icon.item      },
  ];

  return (
    <div className={`shell ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-emoji">🍽️</span>
          {sidebarOpen && (
            <div className="brand-text">
              <span className="brand-title">Digital Menu</span>
              <span className="brand-sub">{user.businessName}</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${activeTab === item.key ? 'nav-active' : ''}`}
              onClick={() => setActiveTab(item.key)}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <button className="nav-item nav-logout" onClick={logout}>
          <span className="nav-icon">{Icon.logout}</span>
          {sidebarOpen && <span className="nav-label">Log Out</span>}
        </button>
      </aside>

      {/* ── Main area ── */}
      <div className="main-area">

        {/* ── Topbar ── */}
        <header className="topbar">
          <button className="hamburger" onClick={() => setSidebarOpen((v) => !v)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <div className="topbar-center">
            <h1 className="topbar-title">
              {activeTab === 'dashboard' && '⚡ Dashboard'}
              {activeTab === 'categories' && '📂 Menu Categories'}
              {activeTab === 'items' && '🍜 Menu Items'}
            </h1>
            <span className="topbar-sub">{user.businessName} · TIN: {user.tin}</span>
          </div>

          <div className="topbar-right">
            <div className="user-chip">
              <div className="user-avatar">{initials}</div>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-role">Service Provider</span>
              </div>
            </div>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="page-content">

          {/* ── DASHBOARD TAB ── */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-view">

              {/* Stats row */}
              <div className="stats-row">
                <StatCard
                  icon={Icon.tag}
                  label="Total Categories"
                  value={categories.length}
                  color="linear-gradient(135deg,#4299e1,#3182ce)"
                />
                <StatCard
                  icon={Icon.item}
                  label="Total Menu Items"
                  value={menuItems.length}
                  color="linear-gradient(135deg,#48bb78,#38a169)"
                />
                <StatCard
                  icon="🍽️"
                  label="Business"
                  value={user.businessName}
                  color="linear-gradient(135deg,#ed8936,#dd6b20)"
                />
                <StatCard
                  icon="🏷️"
                  label="TIN Number"
                  value={user.tin}
                  color="linear-gradient(135deg,#9f7aea,#805ad5)"
                />
              </div>

              {/* Quick actions */}
              <div className="section-title">⚡ Quick Actions</div>
              <div className="quick-actions">
                <button className="qa-btn qa-blue"   onClick={() => setActiveTab('categories')}>
                  ＋ Add Category
                </button>
                <button className="qa-btn qa-green"  onClick={() => setActiveTab('items')}>
                  ＋ Add Menu Item
                </button>
                <button className="qa-btn qa-purple" onClick={() => setActiveTab('categories')}>
                  📂 Manage Categories
                </button>
                <button className="qa-btn qa-orange" onClick={() => setActiveTab('items')}>
                  📋 Manage Items
                </button>
              </div>

              {/* Overview panels */}
              <div className="section-title">📊 Overview</div>
              <div className="overview-grid">
                <div className="overview-card">
                  <div className="ov-header">
                    <span>📂 Recent Categories</span>
                    <button className="ov-link" onClick={() => setActiveTab('categories')}>View all</button>
                  </div>
                  {categories.length === 0 ? (
                    <p className="ov-empty">No categories added yet.</p>
                  ) : (
                    <ul className="ov-list">
                      {categories.slice(-5).reverse().map((c) => (
                        <li key={c.id} className="ov-item">
                          <span className="ov-dot" style={{background:'#4299e1'}} />
                          {c.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="overview-card">
                  <div className="ov-header">
                    <span>🍜 Recent Menu Items</span>
                    <button className="ov-link" onClick={() => setActiveTab('items')}>View all</button>
                  </div>
                  {menuItems.length === 0 ? (
                    <p className="ov-empty">No menu items added yet.</p>
                  ) : (
                    <ul className="ov-list">
                      {menuItems.slice(-5).reverse().map((i) => (
                        <li key={i.id} className="ov-item">
                          <span className="ov-dot" style={{background:'#48bb78'}} />
                          {i.item_name}
                          <span className="ov-price">ETB {Number(i.price).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── CATEGORIES TAB ── */}
          {activeTab === 'categories' && (
            <CategoryManager
              categories={categories}
              setCategories={setCategories}
            />
          )}

          {/* ── ITEMS TAB ── */}
          {activeTab === 'items' && (
            <MenuItemManager
              categories={categories}
              items={menuItems}
              setItems={setMenuItems}
            />
          )}

        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
