import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { SweetProvider } from './context/SweetContext';
import { useAuth } from './context/AuthContext';
import './App.css';

// Lazy load components
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading"></div>
    <p>Loading...</p>
  </div>
);

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, role } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { isAuthenticated, role } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
      } />
      <Route path="/register" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <AdminPanel />
        </ProtectedRoute>
      } />
      <Route path="/" element={
        <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
      } />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <SweetProvider>
        <Router>
          <div className="App">
            <Suspense fallback={<LoadingSpinner />}>
              <AppRoutes />
            </Suspense>
          </div>
        </Router>
      </SweetProvider>
    </AuthProvider>
  );
}

export default App;
