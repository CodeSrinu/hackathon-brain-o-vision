// src/components/mobile/SimpleLoginScreen.tsx
'use client';

import { useState } from 'react';

interface SimpleLoginScreenProps {
  onLogin: (email: string, name: string) => void;
}

export default function SimpleLoginScreen({ onLogin }: SimpleLoginScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!isLogin && !name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Simulate Auth
    if (typeof window !== 'undefined') {
      localStorage.setItem('userEmail', email);
      // For login mode, if we don't have a name, use a default or extract from email, or saved one
      const savedName = localStorage.getItem('userName');
      const userName = isLogin ? (savedName || name || email.split('@')[0]) : name;

      localStorage.setItem('userName', userName);
      onLogin(email, userName);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-4 font-manrope text-[#333333]">
      {/* Header */}
      <div className="flex items-center justify-center py-6">
        <h2 className="text-[#333333] text-xl font-bold leading-tight tracking-[-0.015em]">Career Quest</h2>
      </div>

      {/* Welcome Section */}
      <div className="text-center mb-8 mt-4">
        <h1 className="text-[#333333] text-3xl font-bold leading-tight tracking-tight">
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </h1>
        <p className="text-[#888888] text-lg font-normal leading-normal mt-2">
          {isLogin ? 'Enter your details to continue.' : 'Start your career journey today.'}
        </p>
      </div>

      {/* Form Sections */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        {/* Toggle Switch */}
        <div className="flex bg-[#F5F5F5] p-1 rounded-xl mb-8">
          <button
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${isLogin ? 'bg-white text-[#333333] shadow-sm' : 'text-[#888888]'
              }`}
            onClick={() => setIsLogin(true)}
            type="button"
          >
            Log In
          </button>
          <button
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${!isLogin ? 'bg-white text-[#333333] shadow-sm' : 'text-[#888888]'
              }`}
            onClick={() => setIsLogin(false)}
            type="button"
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name Input (Only for Sign Up) */}
          {!isLogin && (
            <div className="animate-fade-in-up">
              <label className="text-[#333333] text-base font-medium leading-normal pb-2 block" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex. John Doe"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] focus:outline-0 focus:ring-0 border border-[#E0E0E0] bg-[#F5F5F5] focus:border-[#19b357] h-14 placeholder:text-[#888888] p-3.5 text-base font-normal leading-normal"
              />
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="text-[#333333] text-base font-medium leading-normal pb-2 block" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@example.com"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] focus:outline-0 focus:ring-0 border border-[#E0E0E0] bg-[#F5F5F5] focus:border-[#19b357] h-14 placeholder:text-[#888888] p-3.5 text-base font-normal leading-normal"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="text-[#333333] text-base font-medium leading-normal pb-2 block" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password123"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] focus:outline-0 focus:ring-0 border border-[#E0E0E0] bg-[#F5F5F5] focus:border-[#19b357] h-14 placeholder:text-[#888888] p-3.5 text-base font-normal leading-normal"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium animate-pulse">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 bg-[#19b357] text-white text-lg font-bold leading-normal tracking-[0.015em] hover:bg-[#159649] transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              {isLogin ? 'Log In' : 'Create Account'}
            </button>
          </div>
        </form>

        {/* Fake Footer Links */}
        <p className="text-center text-[#888888] text-sm mt-8">
          {isLogin ? (
            <>Don't have an account? <span className="text-[#19b357] font-semibold cursor-pointer" onClick={() => setIsLogin(false)}>Sign Up</span></>
          ) : (
            <>Already have an account? <span className="text-[#19b357] font-semibold cursor-pointer" onClick={() => setIsLogin(true)}>Log In</span></>
          )}
        </p>
      </div>
    </div>
  );
}
