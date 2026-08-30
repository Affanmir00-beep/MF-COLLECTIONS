import React from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const ProfilePage = () => {
  const userInfo = useAuthStore(state => state.userInfo);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center py-16 px-4 bg-[#FAFAFA] font-sans">
      <div className="max-w-3xl w-full">
        <h1 className="font-serif text-3xl uppercase tracking-widest text-[#111111] mb-8 text-center">My Account</h1>
        
        <div className="bg-white p-8 border border-[#EAEAEA] shadow-sm">
          <div className="flex justify-between items-start mb-8 pb-8 border-b border-[#EAEAEA]">
            <div>
              <h2 className="text-xl font-medium mb-1">{userInfo.name}</h2>
              <p className="text-gray-500 text-sm">{userInfo.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
            >
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Order History</h3>
              <p className="text-sm text-gray-600">You haven't placed any orders yet.</p>
            </div>
            
            <div>
              <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Account Details</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p><span className="font-medium text-black">Name:</span> {userInfo.name}</p>
                <p><span className="font-medium text-black">Email:</span> {userInfo.email}</p>
                <p><span className="font-medium text-black">Role:</span> {userInfo.role}</p>
                {(userInfo.role === 'admin' || userInfo.role === 'superadmin') && (
                  <Link 
                    to="/admin/dashboard" 
                    className="inline-block mt-4 bg-[#111111] text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-[#C5A880] transition-colors"
                  >
                    Go to Admin Panel
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
