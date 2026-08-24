import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const schema = yup.object({
  firstName: yup.string().required('The first name is required'),
  lastName: yup.string().required('The last name is required'),
  email: yup.string().email('Invalid email address').required('The email is required'),
  password: yup.string().min(6, 'The password must contain at least 6 characters').required('The password is required'),
  role: yup.string().oneOf(['OWNER', 'GARDENER'], 'Please select a role').required('The role is required'),
}).required();

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: 'GARDENER' }
  });

  const onSubmit = async (data) => {
    try {
      setApiError('');
      await registerUser(data);
      navigate('/');
    } catch (error) {
      const backendErrors = error.response?.data?.validationErrors;
      if (backendErrors) {
         setApiError('Please check the form fields.');
      } else {
         setApiError(error.response?.data?.message || 'An error occurred during registration.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-10 bg-gray-50">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-green-700">GreenSpace</h2>
          <p className="mt-2 text-sm text-gray-600">Create your account to get started</p>
        </div>
        
        {apiError && (
          <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input 
                type="text" 
                {...register("firstName")} 
                className={`w-full p-2 mt-1 border rounded-md focus:ring-green-500 focus:border-green-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
              />
              <p className="mt-1 text-sm text-red-500">{errors.firstName?.message}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input 
                type="text" 
                {...register("lastName")} 
                className={`w-full p-2 mt-1 border rounded-md focus:ring-green-500 focus:border-green-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
              />
              <p className="mt-1 text-sm text-red-500">{errors.lastName?.message}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              {...register("email")} 
              className={`w-full p-2 mt-1 border rounded-md focus:ring-green-500 focus:border-green-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            <p className="mt-1 text-sm text-red-500">{errors.email?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              {...register("password")} 
              className={`w-full p-2 mt-1 border rounded-md focus:ring-green-500 focus:border-green-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            <p className="mt-1 text-sm text-red-500">{errors.password?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">I am a...</label>
            <select 
              {...register("role")} 
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="ROLE_JARDINIER">Gardener looking for a space</option>
              <option value="ROLE_PROPRIETAIRE">Property owner offering a space</option>
            </select>
            <p className="mt-1 text-sm text-red-500">{errors.role?.message}</p>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Registration in progress...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}