import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/401" replace />;
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/403" replace />;
  }

  return children;
}