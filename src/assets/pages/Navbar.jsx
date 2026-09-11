import React, { useEffect, useState } from "react";
import "../css/Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      const count = cart.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0,
      );

      setCartCount(count);
    };

    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  return (
    <>
      <nav>
        <div className="navbar-container">
          <div className="logo">
            <Link to="/home">
              <img src="/images/Logo_png.png" alt="" />
            </Link>
          </div>

          <div className="categories">
            <ul>
              <li>
                <Link to="/home">Home</Link>
              </li>

              <li>
                <Link to="/collection">Products</Link>
              </li>

              <li>
                <Link to="/about">About</Link>
              </li>

              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="search-field">
            <img className="searchicon" src="/images/search icon.png" alt="" />

            <input type="search" placeholder="Search..." />
          </div>

          <div className="nav-list">
            <ul>
              <div className="dropdown1">
                <li>
                  <Link to="/myprofile">
                    <i className="bi bi-person"></i>
                    <span>Profile</span>
                  </Link>
                </li>
              </div>

              <li>
                <Link to="/wishlist">
                  <i className="bi bi-heart"></i>
                  <span>Wishlist</span>
                </Link>
              </li>

              <li>
                <Link to="/cart">
                  <i className="bi bi-bag"></i>
                  <span>Cart</span>

                  {cartCount > 0 && (
                    <span className="cart-count">{cartCount}</span>
                  )}
                </Link>
              </li>
            </ul>
          </div>
          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"}`}></i>
          </button>

          {menuOpen && (
            <div className="mobile-menu">
              <Link to="/home" onClick={() => setMenuOpen(false)}>
                <i className="bi bi-house"></i>
                <span>Home</span>
              </Link>

              <Link to="/collection" onClick={() => setMenuOpen(false)}>
                <i className="bi bi-bag"></i>
                <span>Products</span>
              </Link>

              <Link to="/about" onClick={() => setMenuOpen(false)}>
                <i className="bi bi-info-circle"></i>
                <span>About</span>
              </Link>

              <Link to="/contact" onClick={() => setMenuOpen(false)}>
                <i className="bi bi-telephone"></i>
                <span>Contact</span>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
