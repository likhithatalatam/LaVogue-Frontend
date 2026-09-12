import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
// import "../css/Contact.css";
import API from "../../api";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};

    setFormData((previous) => ({
      ...previous,
      name: storedUser.userName || "",
      email: storedUser.email || "",
    }));
  }, []);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!formData.email.trim()) {
      alert("Please enter your email");
      return;
    }

    if (!formData.subject.trim()) {
      alert("Please enter a subject");
      return;
    }

    if (!formData.message.trim()) {
      alert("Please enter your message");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/contact", formData);

      if (res.data.success) {
        alert("Your message has been sent successfully.");

        const storedUser = JSON.parse(localStorage.getItem("user")) || {};

        setFormData({
          name: storedUser.userName || "",
          email: storedUser.email || "",
          phone: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      console.log("CONTACT FORM ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to send your message. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

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
                  Have a question about your order, products, delivery, or
                  returns?
                  <br />
                  Our LaVogue team is here to help and will get back to you
                  soon.
                </i>
              </p>
            </div>

            <section className="section">
              <div className="section-div">
                <div className="div1">
                  <div className="input-group">
                    <div className="label-input">
                      <label>Your Name*</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="label-input">
                      <label>Your Email*</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <div className="label-input">
                      <label>Your Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="label-input">
                      <label>Subject*</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="message-box">
                    <label>Your Message*</label>
                    <br />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              <button
                type="button"
                id="sub-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
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
