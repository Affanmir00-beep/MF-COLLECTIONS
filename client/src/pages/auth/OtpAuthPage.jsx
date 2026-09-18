import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import apiClient from '../../api/apiClient';

const OtpAuthPage = () => {
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('An OTP has been sent to your email.');
  
  const navigate = useNavigate();
  const location = useLocation();
  const setUserInfo = useAuthStore(state => state.setUserInfo);

  const email = location.state?.email;
  const returnUrl = location.state?.returnUrl || '/';

  useEffect(() => {
    if (!email) {
      // If accessed directly without an email in state, redirect to login
      navigate('/login');
    }
  }, [email, navigate]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = { email, otpCode };
      const { data } = await apiClient.post('/auth/verify-otp', payload);
      
      setUserInfo(data);
      
      if (data.role === 'admin' || data.role === 'superadmin') {
        navigate('/admin/dashboard');
      } else {
        navigate(returnUrl);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null; // Prevent rendering if redirecting

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FAFAFA] font-sans px-4 py-12">
      <div className="max-w-md w-full p-8 bg-white shadow-xl">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl tracking-[0.2em] uppercase text-[#111111]">
            VERIFY OTP
          </h1>
          <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">
            Enter the 6-digit code sent to {email}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 mb-6 text-xs uppercase tracking-wider text-center">
            {error}
          </div>
        )}
        
        {message && !error && (
          <div className="bg-green-50 text-green-700 p-4 mb-6 text-xs uppercase tracking-wider text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">6-Digit OTP</label>
            <input 
              type="text" 
              required
              maxLength="6"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full border border-[#EAEAEA] p-3 text-center tracking-[0.5em] text-lg focus:outline-none focus:border-black transition-colors"
              placeholder="------"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || otpCode.length !== 6}
            className="w-full bg-[#111111] text-white py-4 text-xs uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="w-full mt-4 text-gray-500 py-2 text-xs uppercase tracking-widest hover:text-black transition-colors"
          >
            Go Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpAuthPage;
