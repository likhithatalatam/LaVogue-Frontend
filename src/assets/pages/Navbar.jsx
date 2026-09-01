import React, { useEffect, useState } from "react";
import "../css/Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  const [cartCount, setCartCount] = useState(0);

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
                    Profile
                  </Link>
                </li>
              </div>

              {/* Wishlist - NO COUNT */}
              <li>
                <Link to="/wishlist">
                  <i className="bi bi-heart"></i>
                  Wishlist
                </Link>
              </li>

              {/* Cart - COUNT ONLY */}
              <li>
                <Link to="/cart">
                  <i className="bi bi-bag"></i>
                  Cart
                  {cartCount > 0 && (
                    <span className="cart-count">{cartCount}</span>
                  )}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
