import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import LandingPage from "../landing/LandingPage";
import Contact from "../pages/landing-pages/Contact";
import BrowsePlacePage from "../pages/main-pages/BrowsePlacePage";
import UserPage from "../pages/user-pages/UserPage";
import WelcomeBackPage from "../pages/login-pages/WelcomeBackPage";
import GetStartedPage from "../pages/sign-up-pages/GetStartedPage";
import NotFoundPage from "../pages/NotFoundPage";

import ProtectedRoute from "./ProtectedRoute";
import Footer from "../components/Footer";

function AppRoutes() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Contact page */}
        <Route path="/contact" element={<Contact />} />

        {/* Main pages */}
        <Route path="/browse" element={<BrowsePlacePage />} />

        {/* User pages (protected) */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />

        {/* Auth pages */}
        <Route path="/login" element={<WelcomeBackPage />} />
        <Route path="/signup" element={<GetStartedPage />} />

        {/* 404 Not Found - catch all unmatched routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default AppRoutes;
