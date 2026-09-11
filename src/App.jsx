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

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
