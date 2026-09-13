import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import API from "../../api";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const [billing, setBilling] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    postcode: "",
  });

  const [payment, setPayment] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    if (storedCart.length === 0) {
      navigate("/cart");
    }
  }, [navigate]);

  const getPrice = (product) => {
    return Number(product.offerPrice || product.mrp || 0);
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;

    setBilling((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const subtotal = cart.reduce((total, product) => {
    const price = getPrice(product);

    return total + price * Number(product.quantity || 0);
  }, 0);

  const deduction = 0;

  const total = subtotal - deduction;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (
      !billing.firstName ||
      !billing.lastName ||
      !billing.email ||
      !billing.phone ||
      !billing.streetAddress ||
      !billing.city ||
      !billing.postcode
    ) {
      alert("Please fill all required billing details.");
      return;
    }

    if (!payment) {
      alert("Please select a payment method.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login before placing an order.");
      return;
    }

    try {
      const orderData = {
        billingDetails: billing,

        products: cart.map((item) => ({
          productId: item._id,
          productTitle: item.productTitle,
          image: item.images?.[0] || "",
          color: item.color,
          size: item.size,
          quantity: Number(item.quantity),
          price: getPrice(item),
          total: getPrice(item) * Number(item.quantity),
        })),

        subtotal,

        deduction,

        total,

        paymentMethod: payment,
      };

      console.log("Sending order:", orderData);

      const res = await API.post("/orders", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        alert("Order placed successfully!");

        localStorage.removeItem("cart");

        window.dispatchEvent(new Event("cartUpdated"));

        setCart([]);

        setBilling({
          firstName: "",
          lastName: "",
          companyName: "",
          email: "",
          phone: "",
          streetAddress: "",
          city: "",
          postcode: "",
        });

        setPayment("");
      }
    } catch (error) {
      console.log("ORDER ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");

        alert("Your session has expired. Please login again.");

        return;
      }

      alert(
        error.response?.data?.message ||
          "Something went wrong while placing the order.",
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="checkoutpage">
        <div className="main-container">
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="sub_container">
            <h3>CHECKOUT</h3>

            <div className="sub1">
              <p>Home</p>

              <i className="bi bi-chevron-double-right"></i>

              <p>Checkout Page</p>
            </div>
          </div>

          {/* =================================================
              LOGIN / COUPON
          ================================================= */}

          <div className="sub_container2">
            <div className="sub_2">
              <i className="bi bi-card-list"></i>

              <p>Returning a customer?</p>

              <a href="#">
                <span className="red">Click here to login</span>
              </a>
            </div>

            <div className="sub_2">
              <i className="bi bi-card-list"></i>

              <p>Have a coupon?</p>

              <a href="#">
                <span className="red">Click here to enter your code</span>
              </a>
            </div>
          </div>

          {/* =================================================
              BILLING DETAILS
          ================================================= */}

          <div className="bdmain">
            <div className="bd">
              <div className="bill">
                <h3>BILLING DETAILS</h3>

                {/* FIRST / LAST NAME */}

                <div className="bill2">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name:"
                    value={billing.firstName}
                    onChange={handleBillingChange}
                  />

                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={billing.lastName}
                    onChange={handleBillingChange}
                  />
                </div>

                {/* COMPANY */}

                <div className="bill2-2">
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name:"
                    size="56"
                    value={billing.companyName}
                    onChange={handleBillingChange}
                  />
                </div>

                {/* EMAIL / PHONE */}

                <div className="bill3">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email:"
                    value={billing.email}
                    onChange={handleBillingChange}
                  />

                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number:"
                    value={billing.phone}
                    onChange={handleBillingChange}
                  />
                </div>

                {/* STREET */}

                <div className="bill2-2">
                  <input
                    type="text"
                    name="streetAddress"
                    placeholder="Street Address:"
                    size="56"
                    value={billing.streetAddress}
                    onChange={handleBillingChange}
                  />
                </div>

                {/* CITY / POSTCODE */}

                <div className="bill4">
                  <input
                    type="text"
                    name="city"
                    placeholder="Town City:"
                    value={billing.city}
                    onChange={handleBillingChange}
                  />

                  <input
                    type="text"
                    name="postcode"
                    placeholder="Postcode/zip:"
                    value={billing.postcode}
                    onChange={handleBillingChange}
                  />
                </div>

                <div className="opt">
                  <input type="checkbox" /> Create an account?
                </div>
              </div>

              {/* =================================================
                  DIFFERENT SHIPPING
              ================================================= */}

              <div className="diff">
                <div className="diff-head">
                  <h3>DIFFERENT SHIPPING DETAILS</h3>

                  <input type="checkbox" />
                </div>

                <div className="diff1">
                  <textarea placeholder="Notes about your order,e.g. specialnotes for delivery"></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              ORDER + PAYMENT
          ================================================= */}

          <div className="Thirdpart">
            {/* =================================================
                ORDER DETAILS
            ================================================= */}

            <div className="order">
              <h3>ORDER DETAILS</h3>

              <div className="ord1">
                {/* HEADER */}

                <div className="order1">
                  <p>PRODUCTS</p>

                  <p>TOTAL</p>
                </div>

                {/* PRODUCTS */}

                <div className="order2">
                  <div className="ord2">
                    {cart.length > 0 ? (
                      cart.map((product, index) => (
                        <p
                          key={`${product._id}-${product.color}-${product.size}-${index}`}
                        >
                          {product.productTitle} x{product.quantity}
                          {product.color && <> - {product.color}</>}
                          {product.size && <> / {product.size}</>}
                        </p>
                      ))
                    ) : (
                      <p>Your cart is empty.</p>
                    )}
                  </div>

                  <div className="ord3">
                    {cart.map((product, index) => {
                      const price = getPrice(product);

                      const quantity = Number(product.quantity || 0);

                      return (
                        <p key={`${product._id}-price-${index}`}>
                          ₹{(price * quantity).toFixed(2)}
                        </p>
                      );
                    })}
                  </div>
                </div>

                {/* SUBTOTAL */}

                <div className="order3">
                  <p>SUBTOTAL</p>

                  <p>₹{subtotal.toFixed(2)}</p>
                </div>

                {/* DEDUCTION */}

                <div className="order4">
                  <p>DEDUCTION</p>

                  <p>-₹{deduction.toFixed(2)}</p>
                </div>

                <hr
                  style={{
                    margin: "18px 26px",
                  }}
                />

                {/* TOTAL */}

                <div className="order5">
                  <p>TOTAL</p>

                  <p>₹{total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* =================================================
                PAYMENT
            ================================================= */}

            <div className="payment">
              <h3>PAYMENT METHOD</h3>

              <div className="pay1">
                <div className="p">
                  <p>
                    There is growth in ease. The morning is soft and smooth,
                  </p>

                  <p>at the intersection of order and focus.</p>
                </div>

                <div className="select">
                  {/* UPI */}

                  <div className="in">
                    <input
                      type="radio"
                      name="payment"
                      value="UPI"
                      checked={payment === "UPI"}
                      onChange={(e) => setPayment(e.target.value)}
                    />
                    UPI
                  </div>

                  {/* PAYPAL */}

                  <div className="in">
                    <input
                      type="radio"
                      name="payment"
                      value="PayPal"
                      checked={payment === "PayPal"}
                      onChange={(e) => setPayment(e.target.value)}
                    />
                    PayPal{" "}
                    <span
                      className="red"
                      style={{
                        color: "rgba(var(--bs-link-color-rgb)",
                        marginLeft: "10px",
                      }}
                    >
                      What is PayPal?
                    </span>
                  </div>

                  {/* COD */}

                  <div className="in">
                    <input
                      type="radio"
                      name="payment"
                      value="Cash On Delivery"
                      checked={payment === "Cash On Delivery"}
                      onChange={(e) => setPayment(e.target.value)}
                    />
                    Cash On Delivery
                  </div>
                </div>

                {/* PLACE ORDER */}

                <button
                  type="button"
                  className="sub-button"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </button>
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

export default Checkout;
