import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import apiClient from '../../api/apiClient';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const setUserInfo = useAuthStore(state => state.setUserInfo);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await apiClient.post(
        '/auth/login',
        { email, password }
      );
      
      setUserInfo(data);
      
      // Redirect based on role
      if (data.role === 'admin' || data.role === 'superadmin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FAFAFA] font-sans px-4 py-12">
      <div className="max-w-md w-full p-8 bg-white shadow-xl">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl tracking-[0.2em] uppercase text-[#111111]">SIGN IN</h1>
          <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">Access your account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 mb-6 text-xs uppercase tracking-wider text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#EAEAEA] p-3 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#EAEAEA] p-3 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#111111] text-white py-4 text-xs uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Don't have an account?{' '}
            <Link to="/signup" className="text-black hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
