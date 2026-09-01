import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <section>
      <footer>
        <div className="footer" id="footer-section">
          <div className="footer-details">
            <div className="footer-row">
              <h4>Information</h4>

              <div className="icons">
                <i className="bi bi-chevron-double-right"></i>
                <p>
                  <Link to="/about">FAQ</Link>
                </p>
              </div>

              <div className="icons">
                <i className="bi bi-chevron-double-right"></i>
                <p>
                  <Link to="/about">Location</Link>
                </p>
              </div>

              <div className="icons">
                <i className="bi bi-chevron-double-right"></i>
                <p>
                  <Link to="/about">Terms & Condition</Link>
                </p>
              </div>

              <div className="icons">
                <i className="bi bi-chevron-double-right"></i>
                <p>
                  <Link to="/about">Privacy Policy</Link>
                </p>
              </div>
            </div>

            <div className="footer-row">
              <h4>Category</h4>

              <div className="icons">
                <i className="bi bi-chevron-double-right"></i>
                <p>
                  <Link to="/collection?category=Tops%20%26%20Outwear">
                    Tops & Outwear
                  </Link>
                </p>
              </div>

              <div className="icons">
                <i className="bi bi-chevron-double-right"></i>
                <p>
                  <Link to="/collection?category=Bottoms%20%26%20Jumpsuits">
                    Bottoms & Jumpsuits
                  </Link>
                </p>
              </div>

              <div className="icons">
                <i className="bi bi-chevron-double-right"></i>
                <p>
                  <Link to="/collection?category=Dresses">Dresses</Link>
                </p>
              </div>

              <div className="icons">
                <i className="bi bi-chevron-double-right"></i>
                <p>
                  <Link to="/collection?category=Activewear%20%26%20Athleisure">
                    Activewear & Athleisure
                  </Link>
                </p>
              </div>

              {/* <p><a href="">Sleepwear</a></p> */}
            </div>

            <div className="footer-row">
              <h4>Account</h4>

              <div className="icons">
                <i className="bi bi-chevron-double-right"></i>
                <p>
                  <Link to="/myprofile">My profile</Link>
                </p>
              </div>

              <div className="icons">
                <i className="bi bi-chevron-double-right"></i>
                <p>
                  <Link to="/myorders">Orders</Link>
                </p>
              </div>

              <div className="icons">
                <i className="bi bi-chevron-double-right"></i>
                <p>
                  <Link to="/wishlist">Wishlist</Link>
                </p>
              </div>

              <div className="icons">
                <i className="bi bi-chevron-double-right"></i>
                <p>
                  <Link to="/login">Login/Signup</Link>
                </p>
              </div>
            </div>

            <div className="footer-row">
              <h4>Contact</h4>

              <div className="icons">
                <i className="bi bi-chevron-double-right"></i>
                <p>
                  <Link to="/contact">Customer Support</Link>
                </p>
              </div>

              <div className="social">
                <i className="bi bi-instagram"></i>
                <a href="">@laVogue</a>
              </div>

              <div className="social-icon">
                <i className="bi bi-twitter"></i>
                <a href="">@laVogue</a>
              </div>

              <div className="social-icon">
                <i className="bi bi-facebook"></i>
                <a href="">@LaVogue</a>
              </div>
            </div>
          </div>

          <div className="footer-search">
            <div className="f-search">
              <h4>Sign Up For Our Newsletter</h4>
              <p>
                Stay up-to-date with the latest products, exclusive deals, and
                more.
              </p>
            </div>

            <div className="f-searchbar">
              <input type="search" placeholder="Search.." />
              <i className="bi bi-send"></i>
            </div>
          </div>

          <div className="copy-right">
            <p>Copyright © 2025 Likhitha Talatam, All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </section>
  );
}

export default Footer;
