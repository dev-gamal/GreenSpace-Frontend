import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home"; 
import Dashboard from "./pages/Dashboard"; 
import Layout from "./components/layout/Layout"; 
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from './components/AdminRoute';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Routes d'authentification */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <Register />}
      />

      {/* Landing Page (Home) - Sans Layout, donc SANS Sidebar */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Dashboard - AVEC Layout, donc AVEC Sidebar, Navbar globale et BottomNav */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Interface Administrateur */}
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } 
      />

      {/* Redirection de secours */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;