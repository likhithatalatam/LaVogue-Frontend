import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Home from "./assets/pages/home";
import About from "./assets/pages/About";
import Cart from "./assets/pages/Cart";
import Checkout from "./assets/pages/checkout";
import Collectiongrid from "./assets/pages/Collection-full-grid";
import Collection from "./assets/pages/Collection";
import Contact from "./assets/pages/Contact";
import Myprofile from "./assets/pages/Myprofile";
import ProductDetail from "./assets/pages/ProductDetail";
import Wishlist from "./assets/pages/Wishlist";

import Auth from "./assets/pages/Login";
import Signup from "./assets/pages/Signup";
import ResetPassword from "./assets/pages/ResetPassword.jsx";

import Landing from "./assets/pages/Landing";
import MyOrders from "./assets/pages/MyOrders";
import MyOrderDetails from "./assets/pages/MyOrderDetails";

import ScrollToTop from "./components/ScrollToTop";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function SplashScreen() {
  return (
    <div className="lavogue-splash">
      <div className="lavogue-splash-logo">
        <img src="/images/Logo_png.png" alt="LaVogue" />
      </div>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash && <SplashScreen />}

      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/login" element={<Auth />} />

          <Route path="/signup" element={<Auth />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/collectiongrid"
            element={
              <ProtectedRoute>
                <Collectiongrid />
              </ProtectedRoute>
            }
          />

          <Route
            path="/collection"
            element={
              <ProtectedRoute>
                <Collection />
              </ProtectedRoute>
            }
          />

          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />

          <Route
            path="/myprofile"
            element={
              <ProtectedRoute>
                <Myprofile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          <Route
            path="/myorders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/myorderdetails/:id"
            element={
              <ProtectedRoute>
                <MyOrderDetails />
              </ProtectedRoute>
            }
          />

          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </GoogleOAuthProvider>

      <style>{`
        .lavogue-splash {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100vh;
          background: #e8dbfd;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          animation: lavogueSplashFade 0.6s ease forwards;
          animation-delay: 1.30s;
        }

        .lavogue-splash-logo {
          width: 300px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: lavogueLogoAnimation 1.4s ease-in-out;
        }

        .lavogue-splash-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        @keyframes lavogueLogoAnimation {
          0% {
            opacity: 0;
            transform: scale(0.75);
          }

          40% {
            opacity: 1;
            transform: scale(1);
          }

          75% {
            opacity: 1;
            transform: scale(1.03);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes lavogueSplashFade {
          from {
            opacity: 1;
          }

          to {
            opacity: 0;
            visibility: hidden;
          }
        }

        @media (max-width: 600px) {
          .lavogue-splash-logo {
            width: 170px;
            height: 170px;
          }
        }

        @media (max-width: 380px) {
          .lavogue-splash-logo {
            width: 160px;
            height: 160px;
          }
        }
      `}</style>
    </>
  );
}

export default App;
