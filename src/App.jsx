import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import LandDetails from "./pages/LandDetails";
import Explore from "./pages/Explore";
import Market from "./pages/Market";
import Messages from "./pages/Messages";
import Layout from "./components/layout/Layout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Error401 from "./pages/errors/Error401";
import Error403 from "./pages/errors/Error403";
import Error404 from "./pages/errors/Error404";
import AddGarden from "./pages/AddGarden";
import EditGarden from "./pages/EditGarden";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import HelpCenter from "./pages/HelpCenter";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <Register />}
      />

      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />

      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <Layout>
              <Explore />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            {user?.role === "ADMIN" ? (
              <Layout>
                <AdminDashboard />
              </Layout>
            ) : (
              <Navigate to="/403" replace />
            )}
          </ProtectedRoute>
        }
      />
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

      <Route
        path="/garden/add"
        element={
          <ProtectedRoute>
            <Layout>
              <AddGarden />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/garden/edit/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <EditGarden />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/garden/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <LandDetails />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/market"
        element={
          <ProtectedRoute>
            <Layout>
              <Market />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Layout fullWidth noFooter>
              <Messages />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/401"
        element={
          <Layout>
            <Error401 />
          </Layout>
        }
      />
      <Route
        path="/403"
        element={
          <Layout>
            <Error403 />
          </Layout>
        }
      />
      <Route
        path="/terms"
        element={
          <Layout>
            <Terms />
          </Layout>
        }
      />
      <Route
        path="/privacy"
        element={
          <Layout>
            <Privacy />
          </Layout>
        }
      />
      <Route
        path="/help"
        element={
          <Layout>
            <HelpCenter />
          </Layout>
        }
      />
      <Route
        path="*"
        element={
          <Layout>
            <Error404 />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
