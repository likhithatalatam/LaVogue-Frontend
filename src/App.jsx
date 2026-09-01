import { Routes, Route, Navigate } from "react-router-dom";

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

import Landing from "./assets/pages/Landing";
import MyOrders from "./assets/pages/MyOrders";
import MyOrderDetails from "./assets/pages/MyOrderDetails";

// =====================================================
// PROTECTED ROUTE
// =====================================================

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// =====================================================
// APP
// =====================================================

function App() {
  return (
    <Routes>
      {/* =================================================
          PUBLIC PAGES
      ================================================= */}

      {/* Landing page */}
      <Route path="/" element={<Landing />} />

      {/* Login */}
      <Route path="/login" element={<Auth />} />

      {/* Signup */}
      <Route path="/signup" element={<Auth />} />

      {/* =================================================
          PROTECTED CUSTOMER PAGES
      ================================================= */}

      {/* Home */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* About */}
      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        }
      />

      {/* Cart */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />

      {/* Checkout */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      {/* Collection Grid */}
      <Route
        path="/collectiongrid"
        element={
          <ProtectedRoute>
            <Collectiongrid />
          </ProtectedRoute>
        }
      />

      {/* Collection */}
      <Route
        path="/collection"
        element={
          <ProtectedRoute>
            <Collection />
          </ProtectedRoute>
        }
      />

      {/* Contact */}
      <Route
        path="/contact"
        element={
          <ProtectedRoute>
            <Contact />
          </ProtectedRoute>
        }
      />

      {/* My Profile */}
      <Route
        path="/myprofile"
        element={
          <ProtectedRoute>
            <Myprofile />
          </ProtectedRoute>
        }
      />

      {/* Product */}
      <Route
        path="/product/:id"
        element={
          <ProtectedRoute>
            <ProductDetail />
          </ProtectedRoute>
        }
      />

      {/* Wishlist */}
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />

      {/* My Orders */}
      <Route
        path="/myorders"
        element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        }
      />

      {/* My Order Details */}
      <Route
        path="/myorderdetails/:id"
        element={
          <ProtectedRoute>
            <MyOrderDetails />
          </ProtectedRoute>
        }
      />

      {/* =================================================
          UNKNOWN URL
      ================================================= */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
