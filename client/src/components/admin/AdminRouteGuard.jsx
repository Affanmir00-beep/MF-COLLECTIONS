import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const AdminRouteGuard = () => {
  const userInfo = useAuthStore(state => state.userInfo);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Check if user is logged in and is an admin
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (userInfo.role !== 'admin' && userInfo.role !== 'superadmin') {
    return <Navigate to="/" replace />;
  }

  // Determine which nav items this admin can see.
  // If permissions array is empty = full access (superadmin or main admin).
  // If permissions array has items = restricted admin.
  const perms = userInfo.permissions || [];
  const isRestricted = perms.length > 0;
  const can = (section) => !isRestricted || perms.includes(section);

  // If restricted admin tries to access a page they shouldn't, redirect to products
  // Also catch the bare /admin path which renders a blank <Outlet />
  const isAdminRoot = location.pathname === '/admin' || location.pathname === '/admin/';
  const restrictedPaths = ['/admin/dashboard', '/admin/storefront', '/admin/categories', '/admin/orders'];
  if (isRestricted && (isAdminRoot || restrictedPaths.includes(location.pathname))) {
    return <Navigate to={`/admin/${perms[0]}`} replace />;
  }
  // Redirect full admins from bare /admin to dashboard
  if (!isRestricted && isAdminRoot) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Nav items definition
  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', section: 'dashboard' },
    { label: 'Storefront', path: '/admin/storefront', section: 'storefront' },
    { label: 'Categories', path: '/admin/categories', section: 'categories' },
    { label: 'Products', path: '/admin/products', section: 'products' },
    { label: 'Orders', path: '/admin/orders', section: 'orders' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] text-white hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="font-serif tracking-widest text-2xl uppercase">MF Designs</h2>
          <p className="text-gray-400 text-xs mt-1">
            {isRestricted ? 'Product Manager' : 'Admin Control Panel'}
          </p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.filter(item => can(item.section)).map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 rounded transition-colors uppercase text-xs tracking-widest ${isActive(item.path) ? 'bg-white/10' : 'hover:bg-white/10'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4">
          <button
            onClick={async () => {
              await useAuthStore.getState().logout();
              window.location.href = '/login';
            }}
            className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 uppercase text-xs tracking-widest transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center px-6 md:hidden">
          <h2 className="font-serif tracking-widest text-xl uppercase">MF Designs Admin</h2>
        </header>
        <div className="flex-1 overflow-auto p-6 md:p-10 text-[#111111]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminRouteGuard;

