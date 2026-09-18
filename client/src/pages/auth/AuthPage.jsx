import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import useAuthStore from '../../store/authStore';
import apiClient from '../../api/apiClient';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const setUserInfo = useAuthStore(state => state.setUserInfo);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login Flow
        const { data } = await apiClient.post('/auth/login', { email, password });
        if (data.requiresOtp) {
          navigate('/otp-verify', { state: { email, returnUrl: location.state?.from?.pathname } });
        }
      } else {
        // Signup Flow
        const { data } = await apiClient.post('/auth/signup', { name, email, password });
        navigate('/otp-verify', { state: { email, returnUrl: location.state?.from?.pathname } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const { data } = await apiClient.post('/auth/google', {
        token: credentialResponse.credential
      });
      setUserInfo(data);
      const returnUrl = location.state?.from?.pathname || '/';
      navigate(returnUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Google Auth failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FAFAFA] font-sans px-4 py-12">
      <div className="max-w-md w-full p-8 bg-white shadow-xl">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl tracking-[0.2em] uppercase text-[#111111]">
            {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </h1>
          <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">
            {isLogin ? 'Welcome back to MF Designs' : 'Join the MF Designs community'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 mb-6 text-xs uppercase tracking-wider text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-[#EAEAEA] p-3 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="Jane Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#EAEAEA] p-3 text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Password</label>
            <input 
              type="password" 
              required
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#EAEAEA] p-3 text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#111111] text-white py-4 text-xs uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-xs text-gray-500 uppercase tracking-widest hover:text-black transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>

        <div className="my-8 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-gray-200 after:mt-0.5 after:flex-1 after:border-t after:border-gray-200">
          <p className="mx-4 mb-0 text-center text-xs uppercase text-gray-400 tracking-widest">Or</p>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Login Failed')}
            theme="filled_black"
            shape="rectangular"
            text={isLogin ? "signin_with" : "signup_with"}
          />
        </div>
        
      </div>
    </div>
  );
};

export default AuthPage;
