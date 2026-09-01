import React, { useEffect, useState } from "react";
import "../css/MyProfile.css";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../api";

function MyOrders() {
  const navigate = useNavigate();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // ACTIVE MENU
  // =====================================================

  const isProfileActive = location.pathname === "/myprofile";

  const isOrdersActive =
    location.pathname === "/myorders" ||
    location.pathname.startsWith("/myorderdetails");

  // =====================================================
  // FETCH MY ORDERS
  // =====================================================

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login first");
          navigate("/login");
          return;
        }

        const res = await API.get("/orders/myorders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setOrders(res.data.data || []);
        }
      } catch (error) {
        console.log("MY ORDERS ERROR:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");

          alert("Session expired. Please login again.");

          navigate("/login");
        } else {
          alert(error.response?.data?.message || "Failed to load your orders");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [navigate]);

  // =====================================================
  // STATUS CLASS
  // =====================================================

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

  // =====================================================
  // ORDER ITEM COUNT
  // =====================================================

  const getItemCount = (order) => {
    if (Array.isArray(order.products)) {
      return order.products.reduce(
        (total, product) => total + Number(product.quantity || 0),
        0,
      );
    }

    if (Array.isArray(order.items)) {
      return order.items.reduce(
        (total, item) => total + Number(item.quantity || 1),
        0,
      );
    }

    return 0;
  };

  // =====================================================
  // VIEW ORDER
  // =====================================================

  const handleViewOrder = (orderId) => {
    if (!orderId) return;

    navigate(`/myorderdetails/${orderId}`);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner"></div>

        <h4>Loading your orders...</h4>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <header>
        <div className="logo-nav">
          <img src="/images/Logo_png.png" alt="LaVogue" />
        </div>

        <div className="myprofile">
          <div className="main-container">
            {/* =================================================
                SIDE MENU
            ================================================= */}

            <div className="side-header">
              <div className="profile-img">
                <img src="/images/card4.jpg" alt="Profile" />
              </div>

              <h4>My Account</h4>

              <div className="List">
                <ul>
                  {/* PROFILE */}

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

                  {/* ORDERS */}

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

                  {/* SETTINGS */}

                  <div className="div1">
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      <li>Settings</li>

                      <i className="bi bi-chevron-right"></i>
                    </a>
                  </div>

                  {/* LOGOUT */}

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

            {/* =================================================
                ORDERS CONTENT
            ================================================= */}

            <div className="sub-container">
              {/* TOP ROW */}

              <div className="top-row">
                <div className="heading">
                  <h4>My Orders</h4>
                </div>

                <div className="back-btn" onClick={() => navigate(-1)}>
                  <i className="bi bi-arrow-left"></i>
                  Back
                </div>
              </div>

              {/* =================================================
                  NO ORDERS
              ================================================= */}

              {orders.length === 0 ? (
                <div className="no-orders-container">
                  <i className="bi bi-bag-x"></i>

                  <h4>No orders found</h4>

                  <p>You haven't placed any orders yet.</p>

                  <button type="button" onClick={() => navigate("/collection")}>
                    Continue Shopping
                  </button>
                </div>
              ) : (
                /* =================================================
                   ORDERS TABLE
                ================================================= */

                <div className="orders-table-wrapper">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orders.map((order, index) => {
                        const orderId = order._id || "";

                        const itemCount = getItemCount(order);

                        const total = Number(
                          order.totalAmount ?? order.total ?? 0,
                        );

                        const status =
                          order.orderStatus || order.status || "Pending";

                        return (
                          <tr key={orderId}>
                            {/* S.NO */}

                            <td className="serial-number">{index + 1}</td>

                            {/* ORDER ID */}

                            <td className="order-id">
                              #{orderId.slice(-6).toUpperCase()}
                            </td>

                            {/* DATE */}

                            <td>
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString()
                                : "N/A"}
                            </td>

                            {/* ITEMS */}

                            <td>{itemCount}</td>

                            {/* TOTAL */}

                            <td className="order-total">₹{total.toFixed(2)}</td>

                            {/* PAYMENT */}

                            <td className="payment-text">
                              {order.paymentMethod || "Cash On Delivery"}
                            </td>

                            {/* STATUS */}

                            <td>
                              <span
                                className={`order-status ${getStatusClass(
                                  status,
                                )}`}
                              >
                                {status}
                              </span>
                            </td>

                            {/* ACTION */}

                            <td>
                              <button
                                type="button"
                                className="order-view-btn"
                                onClick={() => handleViewOrder(orderId)}
                              >
                                <i className="bi bi-eye"></i>
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default MyOrders;
