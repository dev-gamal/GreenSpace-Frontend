import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Schéma de validation
const schema = yup.object({
  email: yup.string().email('Invalid email address').required('The email is required'),
  password: yup.string().required('The password is required'),
}).required();

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      setApiError('');
      await login(data);
      navigate('/');
    } catch (error) {
      setApiError(error.response?.data?.message || 'Incorrect credentials or server error.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-green-700">GreenSpace</h2>
          <p className="mt-2 text-sm text-gray-600">Connect to your account</p>
        </div>
        
        {apiError && (
          <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              {...register("email")} 
              className={`w-full p-2 mt-1 border rounded-md focus:ring-green-500 focus:border-green-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="exemple@email.com"
            />
            <p className="mt-1 text-sm text-red-500">{errors.email?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              {...register("password")} 
              className={`w-full p-2 mt-1 border rounded-md focus:ring-green-500 focus:border-green-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="••••••••"
            />
            <p className="mt-1 text-sm text-red-500">{errors.password?.message}</p>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}