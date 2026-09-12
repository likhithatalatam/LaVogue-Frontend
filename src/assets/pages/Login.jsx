import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
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
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

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

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setLoading(true);

      const res = await API.post("/users/google-login", {
        credential: credentialResponse.credential,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        alert("Google login successful");

        navigate("/home", { replace: true });
      }
    } catch (error) {
      console.log("GOOGLE LOGIN ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Google login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!forgotEmail) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/users/forgot-password", {
        email: forgotEmail,
      });

      if (res.data.success) {
        alert("Password reset link sent to your email");
        setForgotEmail("");
        setShowForgotPassword(false);
      }
    } catch (error) {
      console.log("FORGOT PASSWORD ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to send reset link. Please try again.",
      );
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

          {!showForgotPassword ? (
            <>
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
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </button>
                </p>

                <button
                  type="submit"
                  className="auth-submit"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="auth-divider">
                <span>Or</span>
              </div>

              <div className="social-btns">
                {!isSignup && (
                  <div className="google-login-wrapper">
                    <button type="button" className="custom-google-button">
                      <svg
                        className="google-logo"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fill="#4285F4"
                          d="M21.35 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.74 9.74 0 0 0 12 21.6z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M6.53 13.68A5.86 5.86 0 0 1 6.23 12c0-.58.1-1.14.3-1.68V7.79H3.28A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.03 4.21l3.25-2.53z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 6.29c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.37 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.72 5.39l3.25 2.53C7.3 8.01 9.46 6.29 12 6.29z"
                        />
                      </svg>
                      <span>Sign in with Google</span>
                    </button>

                    <div className="google-login-overlay">
                      <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => {
                          alert("Google login failed. Please try again.");
                        }}
                        useOneTap={false}
                        width={300}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mobile-auth-switch">
                <span>Don't have an account?</span>
                <Link to="/signup">Register</Link>
              </div>
            </>
          ) : (
            <div className="forgot-password-view">
              <h2>Forgot Password?</h2>

              <p>Enter your email to receive a password reset link.</p>

              <form onSubmit={handleForgotPassword}>
                <div className="auth-inputs">
                  <input
                    type="email"
                    placeholder="Email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="auth-submit"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <button
                type="button"
                className="forgot-back-button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotEmail("");
                }}
              >
                ← Back to Login
              </button>
            </div>
          )}
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
            {isSignup && (
              <div className="google-login-wrapper">
                <button type="button" className="custom-google-button">
                  <svg
                    className="google-logo"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="#4285F4"
                      d="M21.35 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.74 9.74 0 0 0 12 21.6z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M6.53 13.68A5.86 5.86 0 0 1 6.23 12c0-.58.1-1.14.3-1.68V7.79H3.28A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.03 4.21l3.25-2.53z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 6.29c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.37 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.72 5.39l3.25 2.53C7.3 8.01 9.46 6.29 12 6.29z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </button>

                <div className="google-login-overlay">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => {
                      alert("Google login failed. Please try again.");
                    }}
                    useOneTap={false}
                    width={300}
                  />
                </div>
              </div>
            )}
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
