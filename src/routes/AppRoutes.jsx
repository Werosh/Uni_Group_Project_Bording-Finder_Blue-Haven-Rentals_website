import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import LandingPage from "../landing/LandingPage";
import Contact from "../pages/landing-pages/Contact";
import BrowsePlacePage from "../pages/main-pages/BrowsePlacePage";
import UserPage from "../pages/user-pages/UserPage";
import WelcomeBackPage from "../pages/login-pages/WelcomeBackPage";
import ForgotPwdPage from "../pages/login-pages/ForgotPwdPage";
import PwdResetPage from "../pages/login-pages/PwdResetPage";
import SetNewPwdPage from "../pages/login-pages/SetNewPwdPage";
import AllDonePage from "../pages/login-pages/AllDonePage";
import SignupFlow from "../pages/sign-up-pages/SignupFlow";
import SignupCompletePage from "../pages/sign-up-pages/SignupCompletePage";
import AdminDashboard from "../pages/admin-pages/AdminDashboard";
import NotFoundPage from "../pages/NotFoundPage";

import ProtectedRoute from "./ProtectedRoute";
import Footer from "../components/Footer";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // If there's a hash, try to scroll to that element
      setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // No hash, scroll to top
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return null;
}

function ConditionalFooter() {
  const location = useLocation();
  const hiddenPaths = ["/browse", "/browse-more"];

  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  return <Footer />;
}

function AppRoutes() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Contact page */}
        <Route path="/contact" element={<Contact />} />

        {/* Main pages */}
        <Route path="/browse" element={<BrowsePlacePage />} />
        <Route path="/browse-more" element={<BrowsePlacePage />} />

        {/* User pages (protected) */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />

        {/* Admin pages (protected with admin role) */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Auth pages */}
        <Route path="/login" element={<WelcomeBackPage />} />
        <Route path="/forgot-password" element={<ForgotPwdPage />} />
        <Route path="/password-reset-verification" element={<PwdResetPage />} />
        <Route path="/set-new-password" element={<SetNewPwdPage />} />
        <Route path="/password-reset-success" element={<AllDonePage />} />
        <Route path="/signup" element={<SignupFlow />} />
        <Route path="/signup/complete" element={<SignupCompletePage />} />

        {/* 404 Not Found - catch all unmatched routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ConditionalFooter />
    </Router>
  );
}

export default AppRoutes;
