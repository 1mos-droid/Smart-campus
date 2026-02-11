import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Timetable from './pages/Timetable';
import QRScanner from './pages/QRScanner';
import Dashboard from './pages/Dashboard';
import Logo from './components/Logo';
import AuthContext from './context/AuthContext';
import './index.css';
import './App.css';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

function PrivateRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = React.useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppContent() {
  const { isAuthenticated, logout, user } = React.useContext(AuthContext);
  const location = useLocation();

  const defaultPath = user?.role === 'lecturer' ? '/dashboard' : '/';

  return (
    <div className="App">
      <Header isAuthenticated={isAuthenticated} handleLogout={logout} user={user} />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
            <Route
              path="/scan"
              element={
                <PrivateRoute allowedRoles={['student']}>
                  <PageWrapper><QRScanner /></PageWrapper>
                </PrivateRoute>
              }
            />
             <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={['lecturer']}>
                  <PageWrapper><Dashboard /></PageWrapper>
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  {user?.role === 'lecturer' ? <Navigate to="/dashboard" /> : <PageWrapper><Timetable /></PageWrapper>}
                </PrivateRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

function Header({ isAuthenticated, handleLogout, user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <motion.header
      className="App-header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="header-content">
        <Logo />
        <h1>Smart Attendance</h1>
      </div>
      <nav>
        <AnimatePresence>
        {isAuthenticated ? (
          <>
            {user?.role === 'student' && (
              <>
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Timetable</Link>
                <Link to="/scan" className={`nav-link ${location.pathname === '/scan' ? 'active' : ''}`}>Scan QR</Link>
              </>
            )}
            {user?.role === 'lecturer' && (
              <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>Dashboard</Link>
            )}
            <motion.button
              onClick={handleLogoutClick}
              className="logout-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          </>
        ) : (
          <>
            <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>Login</Link>
            <Link to="/signup" className={`nav-link ${location.pathname === '/signup' ? 'active' : ''}`}>Sign Up</Link>
          </>
        )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
