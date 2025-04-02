import React, { JSX, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import Navbar from "./components/Navbar";

const ConcertList = lazy(() => import("./pages/ConcertList"));
const MyTickets = lazy(() => import("./pages/MyTickets"));
const Login = lazy(() => import("./pages/Login"));
const SeatSelection = lazy(() => import("./pages/SeatSelection"));

const NotFound = () => (
  <Box textAlign="center" py={8}>
    <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
    <h2>Page Not Found</h2>
    <p>Sorry, the page you are looking for could not be found.</p>
  </Box>
);

const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  
  if (!isAuthenticated()) {
    return <Navigate to={`/login?lastPage=${encodeURIComponent(location.pathname)}`} replace />;
  }
  return children;
};

const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100vh"
  >
    <CircularProgress />
  </Box>
);

const AppLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const userLoggedIn = isAuthenticated();

  return (
    <Box sx={{ display: 'flex' }}>
      {userLoggedIn && !isLoginPage && <Navbar />}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          minHeight: '100vh'
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/concerts" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/concerts" element={<ConcertList />} />
            
            {/* Protected routes */}
            <Route
              path="/tickets"
              element={
                <ProtectedRoute>
                  <MyTickets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/concerts/:id/seats"
              element={
                <ProtectedRoute>
                  <SeatSelection />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
