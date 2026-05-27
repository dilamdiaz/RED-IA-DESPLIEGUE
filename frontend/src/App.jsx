// src/App.jsx
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import {
  AuthProvider,
  useAuth
} from './context/AuthContext';

import Navbar from './components/Navbar';

// AUTH
import Login from './pages/Login';
import Register from './pages/Register';

// PRINCIPAL
import Dashboard from './pages/Dashboard';

// MÓDULOS
import Resources from './pages/Resources';
import Foro from './pages/Foro';
import Colaboracion from './pages/Colaboracion';
import MisInscripciones from './pages/MisInscripciones';

// DETALLES
import MasterclassDetalle from './pages/MasterclassDetalle';
import MentoriaDetalle from './pages/MentoriaDetalle';
import ProyectoDetalle from './pages/ProyectoDetalle';

// ======================================
// 🔒 PRIVATE ROUTE
// ======================================

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();

  return token
    ? children
    : <Navigate to="/login" replace />;
};

// ======================================
// 🌐 ROUTES
// ======================================

const AppRoutes = () => {
  const { token } = useAuth();

  return (
    <div className="min-h-screen bg-fondo bg-cover bg-center">

      {/* OVERLAY */}
      <div className="min-h-screen bg-black/60 text-white backdrop-blur-sm">

        <Navbar />

        <Routes>

          {/* ROOT */}
          <Route
            path="/"
            element={
              <Navigate
                to={token ? '/dashboard' : '/login'}
                replace
              />
            }
          />

          {/* AUTH */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* BIBLIOTECA */}
          <Route
            path="/resources"
            element={
              <PrivateRoute>
                <Resources />
              </PrivateRoute>
            }
          />

          {/* FORO */}
          <Route
            path="/foro"
            element={
              <PrivateRoute>
                <Foro />
              </PrivateRoute>
            }
          />

          {/* COLABORACIÓN */}
          <Route
            path="/colaboracion"
            element={
              <PrivateRoute>
                <Colaboracion />
              </PrivateRoute>
            }
          />

          {/* MIS INSCRIPCIONES */}
          <Route
            path="/mis-inscripciones"
            element={
              <PrivateRoute>
                <MisInscripciones />
              </PrivateRoute>
            }
          />

          {/* MASTERCLASS */}
          <Route
            path="/masterclass/:id"
            element={
              <PrivateRoute>
                <MasterclassDetalle />
              </PrivateRoute>
            }
          />

          {/* MENTORÍAS */}
          <Route
            path="/mentoria/:id"
            element={
              <PrivateRoute>
                <MentoriaDetalle />
              </PrivateRoute>
            }
          />

          {/* PROYECTOS */}
          <Route
            path="/proyecto/:id"
            element={
              <PrivateRoute>
                <ProyectoDetalle />
              </PrivateRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>

      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>

      <AuthProvider>
        <AppRoutes />
      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;