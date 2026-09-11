import React, { useEffect, useState } from "react";
import "../css/MyProfile.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API, { getImageUrl } from "../../api";

function MyOrderDetails() {
  const { id } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const isProfileActive = location.pathname === "/myprofile";

  const isOrdersActive =
    location.pathname === "/myorders" ||
    location.pathname.startsWith("/myorderdetails");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login first");
          navigate("/login");
          return;
        }

        const res = await API.get(`/orders/myorders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setOrder(res.data.data);
        }
      } catch (error) {
        console.log("MY ORDER DETAILS ERROR:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");

          alert("Session expired. Please login again.");

          navigate("/login");
        } else {
          alert(
            error.response?.data?.message || "Failed to load order details",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const getStatusClass = (status) => {
    const normalizedStatus = String(status || "")
      .trim()
      .toLowerCase();

    switch (normalizedStatus) {
      case "pending":
        return "pending";

      case "confirmed":
        return "confirmed";

      case "processing":
        return "processing";

      case "shipped":
        return "shipped";

      case "delivered":
        return "delivered";

      case "cancelled":
      case "canceled":
        return "cancelled";

      default:
        return "pending";
    }
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner"></div>

        <h4>Loading order details...</h4>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="orders-loading">
        <i className="bi bi-bag-x order-not-found-icon"></i>

        <h4>Order not found</h4>

        <button
          type="button"
          className="details-back-shopping-btn"
          onClick={() => navigate("/myorders")}
        >
          Back to My Orders
        </button>
      </div>
    );
  }

  const billing = order.billingDetails || {};

  const products = Array.isArray(order.products)
    ? order.products
    : Array.isArray(order.items)
      ? order.items
      : [];

  const orderStatus = order.orderStatus || order.status || "Pending";

  const subtotal = Number(order.subtotal || 0);

  const deduction = Number(order.deduction || 0);

  const total = Number(order.totalAmount ?? order.total ?? 0);

  const paymentMethod = order.paymentMethod || "Cash On Delivery";

  const paymentStatus =
    order.paymentStatus ||
    (paymentMethod === "Cash On Delivery" ? "Pending" : "Paid");

  return (
    <>
      <header>
        <div className="logo-nav">
          <img src="/images/Logo_png.png" alt="LaVogue" />
        </div>

        <div className="myprofile">
          <div className="main-container">
            <div className="side-header">
              <div className="profile-img">
                <img src="/images/card4.jpg" alt="Profile" />
              </div>

              <h4>My Account</h4>

              <div className="List">
                <ul>
                  <div
                    className={`div1 ${isProfileActive ? "active-menu" : ""}`}
                  >
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/myprofile");
                      }}
                    >
                      <li>Profile</li>

                      <i className="bi bi-chevron-right"></i>
                    </a>
                  </div>

                  <div
                    className={`div1 ${isOrdersActive ? "active-menu" : ""}`}
                  >
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/myorders");
                      }}
                    >
                      <li>Orders</li>

                      <i className="bi bi-chevron-right"></i>
                    </a>
                  </div>

                  <div className="div1">
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      <li>Settings</li>

                      <i className="bi bi-chevron-right"></i>
                    </a>
                  </div>

                  <div className="div1">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();

                        localStorage.removeItem("token");
                        localStorage.removeItem("cart");
                        localStorage.removeItem("wishlist");

                        alert("Logged out successfully");

                        navigate("/login");
                      }}
                    >
                      <li>Logout</li>

                      <i className="bi bi-chevron-right"></i>
                    </a>
                  </div>
                </ul>
              </div>
            </div>

            <div className="sub-container order-details-container">
              <div className="top-row">
                <div className="heading">
                  <h4>Order #{order._id?.slice(-6).toUpperCase()}</h4>
                </div>

                <div className="back-btn" onClick={() => navigate("/myorders")}>
                  <i className="bi bi-arrow-left"></i>
                  Back
                </div>
              </div>

              <div className="order-summary-grid">
                <div className="summary-card">
                  <div className="summary-icon">
                    <i className="bi bi-calendar3"></i>
                  </div>

                  <div>
                    <span>ORDER DATE</span>

                    <strong>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "N/A"}
                    </strong>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-icon">
                    <i className="bi bi-credit-card"></i>
                  </div>

                  <div>
                    <span>PAYMENT METHOD</span>

                    <strong>{paymentMethod}</strong>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-icon">
                    <i className="bi bi-box-seam"></i>
                  </div>

                  <div>
                    <span>ORDER STATUS</span>

                    <span
                      className={`order-status ${getStatusClass(orderStatus)}`}
                    >
                      {orderStatus}
                    </span>
                  </div>
                </div>
              </div>

              <section className="details-section">
                <div className="section-title">
                  <div className="section-icon">
                    <i className="bi bi-person"></i>
                  </div>

                  <div>
                    <h4>Customer Details</h4>
                    <p>Shipping and contact information</p>
                  </div>
                </div>

                <div className="customer-grid">
                  <div className="detail-item">
                    <span>Name</span>
                    <strong>
                      {billing.firstName || ""}
                      {billing.lastName ? ` ${billing.lastName}` : ""}
                    </strong>
                  </div>

                  <div className="detail-item">
                    <span>Email</span>
                    <strong>{billing.email || "N/A"}</strong>
                  </div>

                  <div className="detail-item">
                    <span>Phone</span>
                    <strong>{billing.phone || "N/A"}</strong>
                  </div>

                  <div className="detail-item">
                    <span>Company</span>
                    <strong>{billing.companyName || "N/A"}</strong>
                  </div>

                  <div className="detail-item">
                    <span>Street Address</span>
                    <strong>{billing.streetAddress || "N/A"}</strong>
                  </div>

                  <div className="detail-item">
                    <span>City</span>
                    <strong>{billing.city || "N/A"}</strong>
                  </div>

                  <div className="detail-item">
                    <span>Postcode / ZIP</span>
                    <strong>{billing.postcode || "N/A"}</strong>
                  </div>
                </div>
              </section>

              <section className="details-section">
                <div className="section-title">
                  <div className="section-icon">
                    <i className="bi bi-bag"></i>
                  </div>

                  <div>
                    <h4>Order Products</h4>

                    <p>Products included in this order</p>
                  </div>
                </div>

                <div className="products-table-wrapper">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Product</th>
                        <th>Color</th>
                        <th>Size</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                      </tr>
                    </thead>

                    <tbody>
                      {products.length > 0 ? (
                        products.map((product, index) => {
                          const price = Number(product.price || 0);

                          const quantity = Number(product.quantity || 1);

                          const image = product.image;

                          const productName =
                            product.productTitle ||
                            product.title ||
                            product.name ||
                            "Product";

                          return (
                            <tr
                              key={`${
                                product.productId || product._id || index
                              }-${index}`}
                            >
                              <td>
                                <div className="product-image-box">
                                  {image ? (
                                    <img
                                      src={getImageUrl(image)}
                                      alt={productName}
                                    />
                                  ) : (
                                    <i className="bi bi-image"></i>
                                  )}
                                </div>
                              </td>

                              <td>
                                <strong className="product-name">
                                  {productName}
                                </strong>
                              </td>

                              <td>{product.color || "N/A"}</td>

                              <td>{product.size || "N/A"}</td>

                              <td>₹{price.toFixed(2)}</td>

                              <td>{quantity}</td>

                              <td className="product-line-total">
                                ₹{(price * quantity).toFixed(2)}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="7" className="no-products">
                            No products found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="details-section">
                <div className="section-title">
                  <div className="section-icon">
                    <i className="bi bi-wallet2"></i>
                  </div>

                  <div>
                    <h4>Payment Details</h4>

                    <p>Payment information</p>
                  </div>
                </div>

                <div className="payment-grid">
                  <div className="detail-item">
                    <span>Payment Method</span>

                    <strong>{paymentMethod}</strong>
                  </div>

                  <div className="detail-item">
                    <span>Payment Status</span>

                    <strong>{paymentStatus}</strong>
                  </div>
                </div>
              </section>

              <section className="details-section price-section">
                <div className="section-title">
                  <div className="section-icon">
                    <i className="bi bi-receipt"></i>
                  </div>

                  <div>
                    <h4>Price Details</h4>

                    <p>Final order amount</p>
                  </div>
                </div>

                <div className="price-box">
                  <div className="price-row">
                    <span>Subtotal</span>

                    <strong>₹{subtotal.toFixed(2)}</strong>
                  </div>

                  <div className="price-row">
                    <span>Deduction</span>

                    <strong className="deduction">
                      -₹
                      {deduction.toFixed(2)}
                    </strong>
                  </div>

                  <div className="price-divider"></div>

                  <div className="price-row final-total">
                    <span>Total</span>

                    <strong>₹{total.toFixed(2)}</strong>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default MyOrderDetails;
