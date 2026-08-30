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
    // If logged in but not admin, kick them out to homepage
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Basic Sidebar for Admin */}
      <aside className="w-64 bg-[#111111] text-white hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="font-serif tracking-widest text-2xl uppercase">MF Designs</h2>
          <p className="text-gray-400 text-xs mt-1">Admin Control Panel</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to="/admin/dashboard" className={`block px-4 py-3 rounded transition-colors uppercase text-xs tracking-widest ${isActive('/admin/dashboard') ? 'bg-white/10' : 'hover:bg-white/10'}`}>Dashboard</Link>
          <Link to="/admin/storefront" className={`block px-4 py-3 rounded transition-colors uppercase text-xs tracking-widest ${isActive('/admin/storefront') ? 'bg-white/10' : 'hover:bg-white/10'}`}>Storefront</Link>
          <Link to="/admin/categories" className={`block px-4 py-3 rounded transition-colors uppercase text-xs tracking-widest ${isActive('/admin/categories') ? 'bg-white/10' : 'hover:bg-white/10'}`}>Categories</Link>
          <Link to="/admin/products" className={`block px-4 py-3 rounded transition-colors uppercase text-xs tracking-widest ${isActive('/admin/products') ? 'bg-white/10' : 'hover:bg-white/10'}`}>Products</Link>
          <Link to="/admin/orders" className={`block px-4 py-3 rounded transition-colors uppercase text-xs tracking-widest ${isActive('/admin/orders') ? 'bg-white/10' : 'hover:bg-white/10'}`}>Orders</Link>
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
