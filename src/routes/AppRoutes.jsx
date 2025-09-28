import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import LandingPage from "../landing/LandingPage";
import BrowsePlacePage from "../pages/main-pages/BrowsePlacePage";
import UserPage from "../pages/user-pages/UserPage";
import WelcomeBackPage from "../pages/login-pages/WelcomeBackPage";
import GetStartedPage from "../pages/sign-up-pages/GetStartedPage";

import ProtectedRoute from "./ProtectedRoute";
import Footer from "../components/Footer";
import PostAdd from "../pages/main-pages/PostAddPage";

function AppRoutes() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Main pages */}
        <Route path="/browse" element={<BrowsePlacePage />} />
        <Route path="/post-add" element={<PostAdd />} />

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
      </Routes>
      <Footer />
    </Router>
  );
}

export default AppRoutes;
