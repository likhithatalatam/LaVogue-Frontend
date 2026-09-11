import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/login-signup.css";
import API from "../../api.js";

function Auth() {
  const navigate = useNavigate();
  const location = useLocation();

  const isSignup = location.pathname === "/signup";

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [userName, setUserName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/users/login", {
        email: loginEmail,
        password: loginPassword,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        alert("Login successful");

        setLoginEmail("");
        setLoginPassword("");

        navigate("/home", { replace: true });
      }
    } catch (error) {
      console.log("LOGIN ERROR:", error);

      alert(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!userName || !signupEmail || !signupPassword) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/users/register", {
        userName,
        email: signupEmail,
        password: signupPassword,
      });

      if (res.data.success) {
        alert("Registration successful. Please login.");

        setUserName("");
        setSignupEmail("");
        setSignupPassword("");

        navigate("/login");
      }
    } catch (error) {
      console.log("REGISTER ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className={`auth-container ${isSignup ? "signup-mode" : ""}`}>
        <div className="auth-form login-form">
          <img
            src="/images/Logo_png.png"
            alt="LaVogue"
            className="auth-logo"
            fetchPriority="high"
          />

          <h2>Welcome to LaVogue</h2>

          <form onSubmit={handleLogin}>
            <div className="auth-inputs">
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <p className="forgot-password">
              <Link to="">Forgot password?</Link>
            </p>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-divider">
            <span>Or</span>
          </div>

          <div className="social-btns">
            <button type="button">
              <i className="bi bi-google"></i>
              Google
            </button>

            <button type="button">
              <i className="bi bi-facebook"></i>
              Facebook
            </button>
          </div>
          <div className="mobile-auth-switch">
            <span>Don't have an account?</span>
            <Link to="/signup">Register</Link>
          </div>
        </div>

        <div className="auth-form signup-form">
          <img
            src="/images/Logo_png.png"
            alt="LaVogue"
            className="auth-logo"
            fetchPriority="high"
          />

          <h2>Welcome to LaVogue</h2>

          <form onSubmit={handleRegister}>
            <div className="auth-inputs">
              <input
                type="text"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />

              <input
                type="email"
                placeholder="Email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="auth-divider">
            <span>Or register with</span>
          </div>

          <div className="social-btns">
            <button type="button">
              <i className="bi bi-google"></i>
              Google
            </button>

            <button type="button">
              <i className="bi bi-facebook"></i>
              Facebook
            </button>
          </div>
          <div className="mobile-auth-switch">
            <span>Already have an account?</span>
            <Link to="/login">Login</Link>
          </div>
        </div>

        <div className="welcome-panel">
          <div className="welcome-content">
            <img src="/images/logincus.png" alt="Welcome" />

            {!isSignup ? (
              <>
                <h1>Hello, Welcome!</h1>

                <h4>Don't have an account?</h4>

                <Link to="/signup" className="welcome-button">
                  Register
                </Link>
              </>
            ) : (
              <>
                <h1>Welcome Back!</h1>

                <h4>Already have an account?</h4>

                <Link to="/login" className="welcome-button">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Auth;
