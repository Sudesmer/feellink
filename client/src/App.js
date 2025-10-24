import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';

// Components
import Navbar from './components/Navbar';
import LoginNavbar from './components/LoginNavbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Saved from './pages/Saved';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import WorkDetail from './pages/WorkDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import MuseumLogin from './pages/MuseumLogin';
import MuseumDashboard from './pages/MuseumDashboard';
import MuseumPanel from './pages/MuseumPanel';
import NotFound from './pages/NotFound';

// Global styles
const GlobalStyles = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  transition: all 0.3s ease;
  position: relative;
  overflow-x: hidden;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0);
    background-size: 20px 20px;
    opacity: 0.3;
    z-index: -1;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: ${props => props.isAuthPage ? '0' : '80px'}; /* No padding for auth pages */
`;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

function App() {
  const { theme } = useTheme();
  const { loading, user } = useAuth();
  const location = window.location.pathname;

  console.log('App - user:', user); // Debug log

  if (loading) {
    return <LoadingSpinner />;
  }

  // Show different navbar for login/register pages
  const isAuthPage = location === '/login' || location === '/register';
  const isAdminPage = location === '/admin' || location === '/admin-login';
  const isMuseumPage = location === '/museum-login' || location === '/museum-dashboard' || location === '/museum-panel';

  // Show login page if user is not authenticated and not on auth pages
  if (!user && !isAuthPage && !isAdminPage && !isMuseumPage) {
    // Only show login page, don't redirect
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyles>
          <LoginNavbar />
          <MainContent isAuthPage={true}>
            <Login />
          </MainContent>
        </GlobalStyles>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles>
        <AppContainer>
          {isAuthPage ? <LoginNavbar /> : isAdminPage ? null : <Navbar />}
          {isAdminPage ? (
            <AnimatePresence mode="wait">
              <Routes>
                <Route 
                  path="/admin-login" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <AdminLogin />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Admin />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/museum-login" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <MuseumLogin />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/museum-dashboard" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <MuseumDashboard />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/museum-panel" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <MuseumPanel />
                    </motion.div>
                  } 
                />
              </Routes>
            </AnimatePresence>
          ) : (
            <MainContent user={user} isAuthPage={isAuthPage}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Home />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/explore" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Explore />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Profile />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/edit-profile" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <EditProfile />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/profile/:username" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Profile />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/saved" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Saved />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/notifications" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Notifications />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/messages" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Messages />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/work/:id" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <WorkDetail />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/login" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Login />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Register />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/museum-login" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <MuseumLogin />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/museum-dashboard" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <MuseumDashboard />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/museum-panel" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <MuseumPanel />
                    </motion.div>
                  } 
                />
                <Route 
                  path="*" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <NotFound />
                    </motion.div>
                  } 
                />
              </Routes>
            </AnimatePresence>
          </MainContent>
          )}
          {!isAdminPage && <Footer />}
        </AppContainer>
      </GlobalStyles>
    </ThemeProvider>
  );
}

export default App;
