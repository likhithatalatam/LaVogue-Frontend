import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
// import "../css/Contact.css";
function Contact() {
  return (
    <>
      <Navbar />

      <div className="contact_page">
        <div className="main-container">
          <div className="sub_container">
            <h3>CONTACT</h3>
            <div className="sub1">
              <p>Home</p>
              <i className="bi bi-chevron-double-right"></i>
              <p>Contact</p>
            </div>
          </div>

          <section>
            <div className="map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509364!2d144.95373531550408!3d-37.8172099797517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf4c3d09d33c80b4b!2sKing%20St%2C%20Melbourne%20VIC%203000%2C%20Australia!5e0!3m2!1sen!2sin!4v1618518335705!5m2!1sen!2sin"
                width="100%"
                height="400"
                title="map"
              ></iframe>
            </div>
          </section>

          <div className="head_div">
            <div className="heading">
              <h3>GET IN TOUCH</h3>
              <p>
                <i>
                  Nam ac egestas est.Mauris et pulvinar risus,at tincidunt
                  lorem.Maecenas
                  <br />
                  tristique sit amet adio sit amet aliquet.
                </i>
              </p>
            </div>

            <section className="section">
              <div className="section-div">
                <div className="div1">
                  <div className="input-group">
                    <div className="label-input">
                      <label>Your Name*</label>
                      <input type="text" name="name" required />
                    </div>

                    <div className="label-input">
                      <label>Your Email*</label>
                      <input type="email" name="email" required />
                    </div>
                  </div>

                  <div className="input-group">
                    <div className="label-input">
                      <label>Your Number</label>
                      <input type="tel" name="number" />
                    </div>

                    <div className="label-input">
                      <label>Your Website URL</label>
                      <input type="url" name="website" />
                    </div>
                  </div>

                  <div className="message-box">
                    <label>Your Message*</label>
                    <br />
                    <textarea name="message" required></textarea>
                  </div>
                </div>
              </div>

              <button type="submit" id="sub-btn">
                Send Message
              </button>
            </section>
          </div>

          <section>
            <Footer />
          </section>
        </div>
      </div>
    </>
  );
}

export default Contact;
