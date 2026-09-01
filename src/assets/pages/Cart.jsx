import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");

  // =====================================================
  // LOAD CART
  // =====================================================

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // =====================================================
  // PRICE
  // =====================================================

  const getPrice = (product) => {
    return Number(product.offerPrice || product.mrp || 0);
  };

  // =====================================================
  // UPDATE QUANTITY
  // =====================================================

  const updateQuantity = (index, quantity) => {
    const newQuantity = Number(quantity);

    if (newQuantity < 1) {
      return;
    }

    const item = cart[index];

    // Availability of the selected
    // color + size variant
    const availability = Number(item.availability || 0);

    if (newQuantity > availability) {
      alert(
        `Only ${availability} item(s) are available for ${item.color} - ${item.size}`,
      );
      return;
    }

    const updatedCart = cart.map((cartItem, cartIndex) =>
      cartIndex === index
        ? {
            ...cartItem,
            quantity: newQuantity,
          }
        : cartItem,
    );

    setCart(updatedCart);

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // =====================================================
  // REMOVE ITEM
  // =====================================================

  const removeItem = (index) => {
    const updatedCart = cart.filter((_, cartIndex) => cartIndex !== index);

    setCart(updatedCart);

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // =====================================================
  // CALCULATION
  // =====================================================

  const subtotal = cart.reduce((total, item) => {
    const price = getPrice(item);

    return total + price * Number(item.quantity || 0);
  }, 0);

  const deduction = 0;

  const total = subtotal - deduction;

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <Navbar />

      <div className="cartpage">
        <div className="cart-container">
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="heading-div">
            <h3>CART</h3>

            <div className="sub">
              <p>Home</p>

              <i className="bi bi-chevron-double-right"></i>

              <p>Cart</p>
            </div>
          </div>

          {/* =================================================
              ORDERS
          ================================================= */}

          <div className="table-head">
            <h5>YOUR ORDERS</h5>

            <table>
              <thead>
                <tr>
                  <th>ITEM</th>
                  <th>PRODUCT</th>
                  <th>PRICE</th>
                  <th>QUANTITY</th>
                  <th>TOTAL</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {cart.length > 0 ? (
                  cart.map((product, index) => {
                    const price = getPrice(product);

                    const quantity = Number(product.quantity || 1);

                    const availability = Number(product.availability || 0);

                    return (
                      <tr
                        key={`${product._id}-${product.color}-${product.size}-${index}`}
                      >
                        {/* =================================================
                            IMAGE
                        ================================================= */}

                        <td>
                          <img
                            src={`http://localhost:5000/uploads/${product.images?.[0]}`}
                            width="60"
                            height="60"
                            alt={product.productTitle}
                          />
                        </td>

                        {/* =================================================
                            PRODUCT
                        ================================================= */}

                        <td id="product-title">
                          <div>{product.productTitle}</div>

                          {/* COLOR */}

                          {product.color && (
                            <div
                              style={{
                                marginTop: "5px",
                                fontSize: "14px",
                              }}
                            >
                              <strong>Color:</strong> {product.color}
                            </div>
                          )}

                          {/* SIZE */}

                          {product.size && (
                            <div
                              style={{
                                marginTop: "3px",
                                fontSize: "14px",
                              }}
                            >
                              <strong>Size:</strong> {product.size}
                            </div>
                          )}
                        </td>

                        {/* =================================================
                            PRICE
                        ================================================= */}

                        <td>${price.toFixed(2)}</td>

                        {/* =================================================
                            QUANTITY
                        ================================================= */}

                        <td>
                          <input
                            type="number"
                            min="1"
                            max={availability}
                            value={quantity}
                            onChange={(e) =>
                              updateQuantity(index, e.target.value)
                            }
                          />
                        </td>

                        {/* =================================================
                            TOTAL
                        ================================================= */}

                        <td>${(price * quantity).toFixed(2)}</td>

                        {/* =================================================
                            DELETE
                        ================================================= */}

                        <td>
                          <i
                            className="bi bi-trash3"
                            onClick={() => removeItem(index)}
                            style={{
                              cursor: "pointer",
                            }}
                          ></i>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6">Your cart is empty.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* =================================================
              CART SUMMARY
          ================================================= */}

          <div className="cart-summary">
            {/* =================================================
                COUPON
            ================================================= */}

            <div className="apply-coupon">
              <h5>APPLY COUPON</h5>

              <div className="b">
                <div className="div">
                  <label htmlFor="coupon-code">ENTER COUPON CODE</label>

                  <hr />

                  <input
                    type="text"
                    id="coupon-code"
                    placeholder="Example: B549276A"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                </div>

                <button className="apply-btn">Apply Code</button>
              </div>
            </div>

            {/* =================================================
                PRICE CALCULATION
            ================================================= */}

            <div className="price-calculation">
              <h5>PRICE CALCULATION</h5>

              <div className="c">
                {/* SUBTOTAL */}

                <div className="price-row">
                  <span>SUBTOTAL</span>

                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <hr />

                {/* DEDUCTION */}

                <div className="price-row">
                  <span>DEDUCTION</span>

                  <span>-${deduction.toFixed(2)}</span>
                </div>

                <hr />

                {/* TOTAL */}

                <div className="price-row total">
                  <span>TOTAL</span>

                  <span>${total.toFixed(2)}</span>
                </div>

                {/* =================================================
                    BUTTONS
                ================================================= */}

                <div className="checkout-buttons">
                  <button
                    className="checkout-btn"
                    disabled={cart.length === 0}
                    onClick={() => {
                      if (cart.length === 0) {
                        alert(
                          "Your cart is empty. Please add items before checkout.",
                        );
                        return;
                      }

                      window.location.href = "/checkout";
                    }}
                  >
                    Checkout
                  </button>

                  <button className="continue-btn">
                    <Link to="/collection">Continue Shopping</Link>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <section>
            <Footer />
          </section>
        </div>
      </div>
    </>
  );
}

export default Cart;
