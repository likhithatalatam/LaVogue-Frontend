import React, { useState } from "react";
import "../css/login-signup.css";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api.js";

function Signup() {
  const navigate = useNavigate();

  const [userName, setuserName] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const [loading, setLoading] = useState(false);

  // =====================================================
  // REGISTER
  // =====================================================

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!userName || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const userData = {
        userName,
        email,
        password,
      };

      const res = await API.post("/users/register", userData);

      if (res.data.success) {
        alert("Registration successful. Please login.");

        // Clear form
        setuserName("");
        setemail("");
        setpassword("");

        // IMPORTANT:
        // Do NOT save token here.
        // User must login after registration.

        navigate("/login", { replace: true });
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
    <>
      <section className="login">
        <div className="overall-container">
          <div className="sub-container">
            {/* =================================================
                SIGNUP FORM
            ================================================= */}

            <div className="login-container">
              <img src="/images/Logo_png.png" alt="LaVogue" />

              <h4>Welcome to LaVogue</h4>

              <form onSubmit={handleRegister}>
                <div className="input-fields">
                  {/* USERNAME */}

                  <input
                    type="text"
                    placeholder="Username"
                    value={userName}
                    onChange={(e) => setuserName(e.target.value)}
                  />

                  {/* EMAIL */}

                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                  />

                  {/* PASSWORD */}

                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                  />
                </div>

                {/* REGISTER BUTTON */}

                <div className="login-btn">
                  <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                  </button>
                </div>
              </form>

              {/* SOCIAL */}

              <div className="hr-line">
                <hr />

                <h6>Or register with</h6>
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
            </div>

            {/* =================================================
                LOGIN SIDE
            ================================================= */}

            <div className="img-container" id="con">
              <div className="img" id="img">
                <img src="/images/logincus.png" alt="LaVogue" />

                <h1>Welcome Back!</h1>

                <h4>Already have an account?</h4>

                <button id="Login">
                  <Link to="/login">Login</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Signup;
