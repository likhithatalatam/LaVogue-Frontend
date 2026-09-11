import React from "react";
import "../css/login-signup.css";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <section className="landing">
      <div className="landingcontainer">
        <div className="landingsubcontainer">
          <picture>
            <source
              media="(max-width: 480px)"
              srcSet="/images/lan-mobile.png"
            />
            <img
              src="/images/lan.png"
              alt="LaVogue Fashion"
              fetchPriority="high"
            />
          </picture>
        </div>

        <div className="landing-text">
          <h1>LaVogue</h1>

          <p className="subtext">
            Elevate your everyday style with timeless fashion
          </p>

          <p className="tagline">Curated collections for modern elegance</p>

          <div>
            <button type="button">
              <Link to="/login">Shop Now</Link>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Landing;
