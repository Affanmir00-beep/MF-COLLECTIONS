import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import apiClient from '../../api/apiClient';

const OtpAuthPage = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP (and optional Name)
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [name, setName] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const setUserInfo = useAuthStore(state => state.setUserInfo);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { data } = await apiClient.post('/auth/request-otp', { email });
      setIsNewUser(data.isNewUser);
      setMessage(data.message || 'OTP sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = { email, otpCode };
      if (isNewUser && name) {
        payload.name = name;
      }
      
      const { data } = await apiClient.post('/auth/verify-otp', payload);
      
      setUserInfo(data);
      
      // If there's a return URL (e.g., from checkout), go there, else go home
      const returnUrl = location.state?.from?.pathname || '/';
      navigate(returnUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FAFAFA] font-sans px-4 py-12">
      <div className="max-w-md w-full p-8 bg-white shadow-xl">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl tracking-[0.2em] uppercase text-[#111111]">
            {step === 1 ? 'SIGN IN / SIGN UP' : 'VERIFY OTP'}
          </h1>
          <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">
            {step === 1 ? 'Enter your email to continue' : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 mb-6 text-xs uppercase tracking-wider text-center">
            {error}
          </div>
        )}
        
        {message && step === 2 && !error && (
          <div className="bg-green-50 text-green-700 p-4 mb-6 text-xs uppercase tracking-wider text-center">
            {message}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-6">
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

            <button 
              type="submit" 
              disabled={loading || !email}
              className="w-full bg-[#111111] text-white py-4 text-xs uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Continue with Email'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            {isNewUser && (
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
              disabled={loading || otpCode.length !== 6 || (isNewUser && !name)}
              className="w-full bg-[#111111] text-white py-4 text-xs uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
            
            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="w-full mt-4 text-gray-500 py-2 text-xs uppercase tracking-widest hover:text-black transition-colors"
            >
              Change Email
            </button>
          </form>
        )}
        
        {/* Admin Login Link */}
        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">
            <a href="/admin/login" className="hover:text-black transition-colors">Admin Portal</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpAuthPage;
