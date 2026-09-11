import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

import coverImg from "/images/Brown Aesthetic Jewelry and Accessories Etsy Shop Cover.png";
import blog2 from "/images/blog2.jpeg";
import blog3 from "/images/blog3.jpeg";

function About() {
  return (
    <>
      <Navbar />

      <div className="aboutpage">
        <div className="main_container">
          <div className="sub-container">
            <img src={coverImg} alt="cover" />

            <div className="laVogue">
              <h5>LaVogue</h5>
              <p>@laVogue.com</p>
            </div>
          </div>

          <div className="sub_container2">
            <div className="sub2">
              <img src={blog2} alt="blog" />
            </div>

            <div className="sub3">
              <h3>Our Mission & Vision</h3>
              <p>
                We aim to create solutions that empower businesses and enhance
                customer experiences. Our vision is to set new standards in the
                fashion and lifestyle industry through continuous innovation and
                a customer-first approach.
              </p>

              <h3>Our Values</h3>
              <p>
                Integrity & Transparency: We believe in honest and ethical
                business practices. <br />
                Innovation & Excellence: Pushing boundaries to deliver
                cutting-edge solutions. <br />
                Customer Commitment: Your satisfaction is our top priority{" "}
                <br />
                Sustainability & Responsibility: Making a positive impact on
                society and the environment.
              </p>
            </div>
          </div>

          <div className="sub_container3">
            <div className="sub_container1">
              <h3>Welcome to LaVogue!</h3>
              <p>
                At LaVogue, we believe that shopping should be more than just a
                transaction. It should be an experience — a journey where you
                discover new and exciting products, find exactly what you need,
                and feel great about your purchase.
              </p>

              <h3>Our Goal</h3>
              <p>
                Our goal is simple: to provide our customers with a personalized
                shopping experience that is convenient, efficient, and
                trustworthy.
              </p>
            </div>

            <div className="sub">
              <a href="/">
                <img src={blog3} width="350" height="400" alt="blog3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default About;
