import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Timetable from './pages/Timetable';
import QRScanner from './pages/QRScanner';
import Logo from './components/Logo';
import AuthContext from './context/AuthContext';
import './index.css'; // Global styles
import './App.css'; // App-specific styles

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

function PrivateRoute({ children }) {
  const { isAuthenticated } = React.useContext(AuthContext);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function AppContent() {
  const { isAuthenticated, logout } = React.useContext(AuthContext);
  const location = useLocation();

  return (
    <div className="App">
      <Header isAuthenticated={isAuthenticated} handleLogout={logout} />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
            <Route
              path="/scan"
              element={
                <PrivateRoute>
                  <PageWrapper><QRScanner /></PageWrapper>
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <PageWrapper><Timetable /></PageWrapper>
                </PrivateRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

function Header({ isAuthenticated, handleLogout }) {
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
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Timetable</Link>
            <Link to="/scan" className={`nav-link ${location.pathname === '/scan' ? 'active' : ''}`}>Scan QR</Link>
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
