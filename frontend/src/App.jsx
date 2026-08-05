import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Spinner from './components/Spinner';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Pets = lazy(() => import('./pages/Pets'));
const PetDetail = lazy(() => import('./pages/PetDetail'));
const PetPrint = lazy(() => import('./pages/PetPrint'));
const Community = lazy(() => import('./pages/Community'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const Caregivers = lazy(() => import('./pages/Caregivers'));

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/pets" element={<ProtectedRoute><Pets /></ProtectedRoute>} />
          <Route path="/pets/:petId" element={<ProtectedRoute><PetDetail /></ProtectedRoute>} />
          <Route path="/pets/:petId/print" element={<ProtectedRoute><PetPrint /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
          <Route path="/community/:postId" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
          <Route path="/caregivers" element={<ProtectedRoute><Caregivers /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
