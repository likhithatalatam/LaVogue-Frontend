import React, { useEffect, useState } from "react";
import "../css/MyProfile.css";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../api";

function MyProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState({
    userName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isProfileActive = location.pathname === "/myprofile";

  const isOrdersActive =
    location.pathname === "/myorders" ||
    location.pathname.startsWith("/myorderdetails");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login first");
          navigate("/login");
          return;
        }

        const res = await API.get("/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          const user = res.data.data;

          setProfile({
            userName: user.userName || "",
            email: user.email || "",
            phone: user.phone || "",
            location: user.location || "",
            bio: user.bio || "",
          });
        }
      } catch (error) {
        console.log("PROFILE ERROR:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");

          alert("Session expired. Please login again.");

          navigate("/login");
        } else {
          alert(error.response?.data?.message || "Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      setSaving(true);

      const res = await API.put("/users/profile", profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        const updatedUser = res.data.data;

        setProfile({
          userName: updatedUser.userName || "",
          email: updatedUser.email || "",
          phone: updatedUser.phone || "",
          location: updatedUser.location || "",
          bio: updatedUser.bio || "",
        });

        alert("Profile updated successfully");
      }
    } catch (error) {
      console.log("UPDATE PROFILE ERROR:", error);

      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");

    alert("Logged out successfully");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner"></div>
        <h4>Loading profile...</h4>
      </div>
    );
  }

  return (
    <>
      <header>
        <div className="logo-nav">
          <img src="/images/Logo_png.png" alt="LaVogue" />
          <div className="back-btn" onClick={() => navigate("/home")}>
            <i className="bi bi-house-door"></i>Home
          </div>
        </div>

        <div className="myprofile">
          <div className="main-container">
            <div className="side-header">
              <div className="profile-img">
                <img src="/images/card4.jpg" alt="Profile" />
              </div>

              <h4>{profile.userName || "User"}</h4>

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
                        handleLogout();
                      }}
                    >
                      <li>Logout</li>

                      <i className="bi bi-chevron-right"></i>
                    </a>
                  </div>
                </ul>
              </div>
            </div>

            <div className="sub-container">
              <div className="top-row">
                <div className="heading">
                  <h4>Profile</h4>
                </div>
                <div className="back-btn" onClick={() => navigate("/home")}>
                  <i className="bi bi-house-door"></i> Back to Home
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div>
                  <label>Name</label>

                  <input
                    type="text"
                    name="userName"
                    value={profile.userName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>Username</label>

                  <input type="text" value={profile.userName} readOnly />
                </div>

                <div>
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>Phone number</label>

                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>Location</label>

                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>Bio</label>

                  <textarea
                    rows="1"
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="btn-div">
                  <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default MyProfile;
