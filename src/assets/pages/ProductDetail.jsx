import React, { useEffect, useMemo, useState } from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";

import API, { getImageUrl } from "../../api";

import { useParams } from "react-router-dom";

function ProductDetail() {
  const [product, setproduct] = useState({});

  const [mainImage, setMainImage] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const { id } = useParams();

  useEffect(() => {
    const fetchproduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);

        const productData = res.data.data;

        setproduct(productData);

        setMainImage(productData.images?.[0] || "");

        setSelectedColor("");
        setSelectedSize("");
        setQuantity(1);
      } catch (error) {
        console.log(error);
      }
    };

    fetchproduct();
  }, [id]);

  const availableColors = useMemo(() => {
    if (!product.variants) {
      return [];
    }

    const colors = product.variants
      .map((variant) => variant.color)
      .filter((color) => color && color.trim() !== "");

    return [...new Set(colors)];
  }, [product.variants]);

  const availableSizes = useMemo(() => {
    if (!product.variants || !selectedColor) {
      return [];
    }

    const sizes = product.variants
      .filter((variant) => variant.color === selectedColor)
      .map((variant) => variant.size)
      .filter((size) => size && size.trim() !== "");

    return [...new Set(sizes)];
  }, [product.variants, selectedColor]);

  const selectedVariant = useMemo(() => {
    if (!product.variants || !selectedColor || !selectedSize) {
      return null;
    }

    return (
      product.variants.find(
        (variant) =>
          variant.color === selectedColor && variant.size === selectedSize,
      ) || null
    );
  }, [product.variants, selectedColor, selectedSize]);

  const selectedAvailability = selectedVariant
    ? Number(selectedVariant.availability || 0)
    : 0;

  const handleColorChange = (color) => {
    setSelectedColor(color);

    setSelectedSize("");

    setQuantity(1);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);

    setQuantity(1);
  };

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);

    if (!selectedVariant) {
      setQuantity(1);
      return;
    }

    if (value < 1) {
      setQuantity(1);
      return;
    }

    if (value > selectedAvailability) {
      setQuantity(selectedAvailability);
      return;
    }

    setQuantity(value);
  };

  const handleAddToWishlist = () => {
    const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const alreadyExists = existingWishlist.some(
      (item) => item._id === product._id,
    );

    if (alreadyExists) {
      alert("Product is already in wishlist");
      return;
    }

    const updatedWishlist = [
      ...existingWishlist,
      {
        _id: product._id,
        productTitle: product.productTitle,
        images: product.images,
        mrp: product.mrp,
        offerPrice: product.offerPrice,
        variants: product.variants,
      },
    ];

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    alert("Product added to wishlist");
  };

  const handleAddToCart = () => {
    if (!selectedColor) {
      alert("Please select a color");
      return;
    }

    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    if (!selectedVariant) {
      alert("Selected color and size are not available");
      return;
    }

    if (selectedAvailability <= 0) {
      alert("Selected color and size are out of stock");
      return;
    }

    if (quantity > selectedAvailability) {
      alert(
        `Only ${selectedAvailability} item(s) are available for ${selectedColor} - ${selectedSize}`,
      );
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = existingCart.find(
      (item) =>
        item._id === product._id &&
        item.color === selectedColor &&
        item.size === selectedSize,
    );

    let updatedCart;

    if (existingProduct) {
      const newQuantity = Number(existingProduct.quantity) + Number(quantity);

      if (newQuantity > selectedAvailability) {
        alert(
          `You can add only ${selectedAvailability} item(s) of ${selectedColor} - ${selectedSize}`,
        );
        return;
      }

      updatedCart = existingCart.map((item) =>
        item._id === product._id &&
        item.color === selectedColor &&
        item.size === selectedSize
          ? {
              ...item,
              quantity: newQuantity,
              availability: selectedAvailability,
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

          quantity: quantity,

          color: selectedColor,

          size: selectedSize,

          availability: selectedAvailability,
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cartUpdated"));

    alert("Product added to cart");
  };

  return (
    <>
      <Navbar />

      <div className="productdetail_page">
        <div className="main-container">
          <div className="sub-header">
            <h2>PRODUCT</h2>

            <div className="sub1">
              <p>Home</p>

              <i className="bi bi-chevron-double-right"></i>

              <p>Product Details</p>
            </div>
          </div>

          <div className="product-container">
            <div className="pro-img-section">
              <div className="product-img">
                {mainImage && (
                  <img
                    src={getImageUrl(mainImage)}
                    alt={product.productTitle}
                  />
                )}
              </div>

              <div className="product-imgs">
                {product.images?.map((img, index) => (
                  <img
                    key={index}
                    src={getImageUrl(img)}
                    alt={`${product.productTitle} ${index + 1}`}
                    onClick={() => setMainImage(img)}
                    className={mainImage === img ? "active-thumbnail" : ""}
                  />
                ))}
              </div>
            </div>

            <div className="product-details">
              <h4>{product.productTitle}</h4>

              <h6>
                <b>Availability: </b>

                {selectedColor && selectedSize
                  ? selectedAvailability
                  : "Select color and size"}
              </h6>

              <div className="ratings">
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-half"></i>
              </div>

              <h6>
                <span id="actual-price">${product.mrp}</span> $
                {product.offerPrice || product.mrp}
              </h6>

              <div className="detail">
                <p>{product.productDescription}</p>
              </div>

              <div className="detail">
                <p>
                  <b>Category:</b> {product.category?.categoryName || "N/A"}
                </p>

                <p>
                  <b>Sub Category:</b>{" "}
                  {product.subCategory?.subCategoryName || "N/A"}
                </p>

                <p>
                  <b>Brand:</b> {product.brand?.brandName || "N/A"}
                </p>
              </div>

              <div className="input-label-set">
                <div className="input-label1">
                  <label>Qty:</label>

                  <input
                    type="number"
                    value={quantity}
                    min="1"
                    max={selectedVariant ? selectedAvailability : 1}
                    disabled={!selectedVariant}
                    onChange={handleQuantityChange}
                  />
                </div>
              </div>

              <div className="variant-selection color-selection">
                <label>Color:</label>

                <div className="variant-options">
                  {availableColors.length > 0 ? (
                    availableColors.map((color, index) => (
                      <button
                        type="button"
                        key={index}
                        className={
                          selectedColor === color
                            ? "variant-option selected"
                            : "variant-option"
                        }
                        onClick={() => handleColorChange(color)}
                      >
                        {color}
                      </button>
                    ))
                  ) : (
                    <p>No colors available</p>
                  )}
                </div>
              </div>

              <div className="variant-selection size-selection">
                <label>Size:</label>

                <div className="variant-options">
                  {!selectedColor ? (
                    <p>Please select a color</p>
                  ) : availableSizes.length > 0 ? (
                    availableSizes.map((size, index) => (
                      <button
                        type="button"
                        key={index}
                        className={
                          selectedSize === size
                            ? "variant-option selected"
                            : "variant-option"
                        }
                        onClick={() => handleSizeChange(size)}
                      >
                        {size}
                      </button>
                    ))
                  ) : (
                    <p>No sizes available</p>
                  )}
                </div>
              </div>

              <div className="tag-buttons">
                <h5>Tags</h5>

                {product.category?.categoryName && (
                  <button>
                    <i className="bi bi-tags-fill"></i>

                    {product.category.categoryName}
                  </button>
                )}

                {product.subCategory?.subCategoryName && (
                  <button>
                    <i className="bi bi-tags-fill"></i>

                    {product.subCategory.subCategoryName}
                  </button>
                )}

                {product.brand?.brandName && (
                  <button>
                    <i className="bi bi-tags-fill"></i>

                    {product.brand.brandName}
                  </button>
                )}

                {selectedColor && (
                  <button>
                    <i className="bi bi-tags-fill"></i>

                    {selectedColor}
                  </button>
                )}

                {selectedSize && (
                  <button>
                    <i className="bi bi-tags-fill"></i>

                    {selectedSize}
                  </button>
                )}
              </div>

              <div className="order">
                <button onClick={handleAddToCart}>ADD TO CART</button>

                <div className="heart">
                  <button onClick={handleAddToWishlist}>
                    <i className="bi bi-heart-fill"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="product-description">
            <h4>PRODUCT DESCRIPTION</h4>

            <p>{product.productDescription}</p>
          </div>

          <div className="product-review">
            <h4>PRODUCT REVIEWS</h4>

            <div className="mar">
              <div className="review-list">
                <div className="review-detail">
                  <img src="/images/ban1.jpg" alt="" />

                  <h6>JOHN DOE | 20 JAN 2017</h6>
                </div>

                <p>
                  sapien massa, convallis a pellentesq ue neCurabitur aliquet
                  quam id dui posuere.
                </p>
              </div>

              <div className="review-list">
                <div className="review-detail">
                  <img src="/images/ban2.jpg" alt="" />

                  <h6>JOHN DOE | 10 FEB 2017</h6>
                </div>

                <p>
                  sapien massa, convallis a pellentesq ue neCurabitur aliquet
                  quam id dui posuere.
                </p>
              </div>

              <div className="review-list">
                <div className="review-detail">
                  <img src="/images/ban3.jpg" alt="" />

                  <h6>JOHN DOE | 15 MAY 2017</h6>
                </div>

                <p>
                  sapien massa, convallis a pellentesq ue neCurabitur aliquet
                  quam id dui posuere.
                </p>
              </div>
            </div>
          </div>

          <div className="leave-review-section">
            <h4>LEAVE REVIEW</h4>

            <input
              className="review-name-field"
              type="text"
              placeholder="Your Name"
            />

            <input
              className="review-email-field"
              type="text"
              placeholder="Your Email"
            />

            <br />

            <textarea placeholder="Your Message"></textarea>

            <button type="button">Submit</button>
          </div>

          <section>
            <Footer />
          </section>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
