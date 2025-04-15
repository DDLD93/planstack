import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Mail, ArrowLeft } from 'lucide-react';
import { Logo } from '../assets';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Password reset failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <Link to="/login" className="flex items-center text-gray-600 mb-6 hover:text-red-600 transition-colors duration-200">
          <ArrowLeft size={20} className="mr-2" />
          Back to Login
        </Link>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
          <div className=" flex items-center justify-center">
         <img src={Logo} alt="logo" className=' w-[100%] h-[100%]' />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600 mt-2">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Send Reset Instructions
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <div className="text-green-600 text-2xl">✓</div>
            </div>
            <div className="text-green-600 font-medium">
              Reset instructions sent!
            </div>
            <p className="text-gray-600 mb-6">
              Please check your email for instructions to reset your password.
            </p>
            <Link
              to="/login"
              className="inline-block text-red-600 hover:text-red-800 transition-colors duration-200"
            >
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;