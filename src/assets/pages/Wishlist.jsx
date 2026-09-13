import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";

import API, { getImageUrl } from "../../api";
function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    setWishlist(storedWishlist);
  }, []);

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== id);

    setWishlist(updatedWishlist);

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const addToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = existingCart.find(
      (item) => item._id === product._id,
    );

    let updatedCart;

    if (existingProduct) {
      updatedCart = existingCart.map((item) =>
        item._id === product._id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          _id: product._id,
          productTitle: product.productTitle,
          images: product.images,
          mrp: product.mrp,
          offerPrice: product.offerPrice,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    alert("Product added to cart");
  };

  return (
    <>
      <Navbar />

      <div className="wishlist_page">
        <div className="main-container">
          <div className="sub_container">
            <h3>WISHLIST</h3>

            <div className="sub1">
              <p>Home</p>

              <i className="bi bi-chevron-double-right"></i>

              <p>Wishlist</p>
            </div>
          </div>

          <div className="section">
            <div className="collection-section">
              {wishlist.length > 0 ? (
                Array.from({
                  length: Math.ceil(wishlist.length / 4),
                }).map((_, rowIndex) => (
                  <div className="latest-collection-cards" key={rowIndex}>
                    {wishlist
                      .slice(rowIndex * 4, rowIndex * 4 + 4)
                      .map((product) => {
                        const price = Number(
                          product.offerPrice || product.mrp || 0,
                        );

                        return (
                          <div className="card1" key={product._id}>
                            <Link
                              to={`/product/${product._id}`}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              <img
                                src={getImageUrl(product.images?.[0])}
                                alt={product.productTitle}
                              />

                              <h5>{product.productTitle}</h5>
                            </Link>

                            <div className="rating-icons">
                              <i className="bi bi-star-fill"></i>

                              <i className="bi bi-star-fill"></i>

                              <i className="bi bi-star-fill"></i>

                              <i className="bi bi-star-fill"></i>

                              <i className="bi bi-star-half"></i>
                            </div>

                            <h6>₹{price}</h6>

                            <hr />
                            <div className="add-delete">
                              <p>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    addToCart(product);
                                  }}
                                >
                                  Add to Cart
                                </a>
                              </p>

                              <p>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeFromWishlist(product._id);
                                  }}
                                  style={{
                                    color: "red",
                                  }}
                                >
                                  Remove
                                </a>
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ))
              ) : (
                <div className="noproducts">
                  <p>Your wishlist is empty...</p>
                </div>
              )}
            </div>
          </div>

          <section>
            <Footer />
          </section>
        </div>
      </div>
    </>
  );
}

export default Wishlist;
