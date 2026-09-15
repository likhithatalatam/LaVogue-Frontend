import React, { useEffect, useRef, useState } from "react";
import "../css/MyProfile.css";
import { useLocation, useNavigate } from "react-router-dom";
import API, { getImageUrl } from "../../api";
import Cropper from "react-easy-crop";

function MyProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    userName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const isProfileActive = location.pathname === "/myprofile";

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppingImage, setCroppingImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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
            profileImage: user.profileImage || "",
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

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();

      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));

      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.9,
      );
    });
  };

  const handleCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleCropCancel = () => {
    setCroppingImage(null);
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropSave = async () => {
    if (!croppingImage || !croppedAreaPixels) return;

    try {
      setUploadingImage(true);

      const croppedBlob = await getCroppedImg(
        croppingImage.url,
        croppedAreaPixels,
      );

      const croppedFile = new File([croppedBlob], croppingImage.file.name, {
        type: "image/jpeg",
      });

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("profileImage", croppedFile);

      const res = await API.put("/users/profile/image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        const updatedUser = res.data.data;

        setProfile((prev) => ({
          ...prev,
          profileImage: updatedUser.profileImage || "",
        }));

        const storedUser = JSON.parse(localStorage.getItem("user")) || {};

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            profileImage: updatedUser.profileImage || "",
          }),
        );

        alert("Profile photo updated successfully");
        handleCropCancel();
      }
    } catch (error) {
      console.log("PROFILE IMAGE ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert("Session expired. Please login again");
        navigate("/login");
      } else {
        alert(
          error.response?.data?.message || "Failed to update profile photo",
        );
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setCroppingImage({
      url: imageUrl,
      file,
    });

    setCrop({ x: 0, y: 0 });
    setZoom(1);
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
          profileImage: updatedUser.profileImage || "",
        });

        const storedUser = JSON.parse(localStorage.getItem("user")) || {};

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            ...updatedUser,
          }),
        );

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
              <div
                className="profile-img"
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  src={
                    profile.profileImage
                      ? getImageUrl(profile.profileImage)
                      : "/images/ca.jpg"
                  }
                  alt="Profile"
                />

                <div className="profile-camera">
                  <i className="bi bi-camera-fill"></i>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
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
      {croppingImage && (
        <div className="crop-overlay">
          <div className="crop-container">
            <h3>Crop Profile Photo</h3>

            <div className="crop-area">
              <Cropper
                image={croppingImage.url}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={handleCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="crop-zoom">
              <label>Zoom</label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
            </div>

            <div className="crop-buttons">
              <button
                type="button"
                onClick={handleCropCancel}
                disabled={uploadingImage}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCropSave}
                disabled={uploadingImage}
              >
                {uploadingImage ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MyProfile;
