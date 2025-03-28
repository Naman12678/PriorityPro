import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, clearError } from '../store/authSlice';
import { LogIn, UserPlus, Loader, Eye, EyeOff } from 'lucide-react';

// Reusable Input Component with Enhanced Styling
const InputField = ({ 
  id, 
  name, 
  type, 
  value, 
  onChange, 
  placeholder, 
  label, 
  required = true,
  error,
  showPassword,
  onTogglePassword
}) => (
  <div className="relative">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        name={name}
        type={showPassword && type === 'password' ? 'text' : type}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          w-full px-4 py-3 border rounded-lg focus:outline-none 
          ${error ? 'border-red-500 text-red-700' : 'border-gray-300 focus:border-blue-500'}
          ${type === 'password' ? 'pr-10' : ''}
        `}
        placeholder={placeholder}
      />
      {type === 'password' && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Basic form validation
    let errors = { ...formErrors };
    if (name === 'email') {
      errors.email = !value.includes('@') ? 'Please enter a valid email' : '';
    }
    if (name === 'password') {
      errors.password = value.length < 6 ? 'Password must be at least 6 characters' : '';
    }
    if (name === 'username' && !isLogin) {
      errors.username = value.length < 3 ? 'Username must be at least 3 characters' : '';
    }
    setFormErrors(errors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());

    // Validate form before submission
    const newErrors = {};
    if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!isLogin && formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    if (isLogin) {
      dispatch(login({ email: formData.email, password: formData.password }));
    } else {
      dispatch(register(formData));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to continue' : 'Sign up to get started'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <InputField
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                label="Username"
                error={formErrors.username}
              />
            )}

            <InputField
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              label="Email"
              error={formErrors.email}
            />

            <InputField
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              label="Password"
              error={formErrors.password}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg 
                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
            >
              {loading ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : isLogin ? (
                <>
                  <LogIn size={22} />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus size={22} />
                  Sign Up
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  dispatch(clearError());
                  setFormErrors({});
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium 
                           transition duration-300 ease-in-out hover:underline"
              >
                {isLogin 
                  ? "Don't have an account? Sign Up" 
                  : 'Already have an account? Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;