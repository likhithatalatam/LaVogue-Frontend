import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import API, { getImageUrl } from "../../api";
import { Link } from "react-router-dom";

function Home() {
  const [categories, setcategories] = useState([]);
  const [brands, setbrands] = useState([]);
  const [products, setproducts] = useState([]);

  const [homeData, setHomeData] = useState({
    heroBanners: [],
    carouselImages: [],
    couponBanners: [],
    bestSellerLimit: 8,
    bestSellerActive: true,
    bestSellers: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [categoriesRes, brandsRes, productsRes, homeRes] =
          await Promise.all([
            API.get("/categories"),
            API.get("/brands"),
            API.get("/products"),
            API.get("/home"),
          ]);

        setcategories(categoriesRes.data.data || []);

        setbrands(brandsRes.data.data || []);

        setproducts(productsRes.data.data || []);

        if (homeRes.data.success) {
          setHomeData({
            heroBanners: homeRes.data.data?.heroBanners || [],
            carouselImages: homeRes.data.data?.carouselImages || [],
            couponBanners: homeRes.data.data?.couponBanners || [],
            bestSellerLimit: homeRes.data.data?.bestSellerLimit || 8,
            bestSellerActive: homeRes.data.data?.bestSellerActive ?? true,
            bestSellers: homeRes.data.data?.bestSellers || [],
          });
        }
      } catch (error) {
        console.log("HOME DATA ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const latestProducts = [...products]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();

      const dateB = new Date(b.createdAt || 0).getTime();

      return dateB - dateA;
    })
    .slice(0, 8);

  const bestSellerProducts = homeData.bestSellers || [];

  const activeHeroBanners = (homeData.heroBanners || [])
    .filter((banner) => banner.isActive)
    .sort((a, b) => {
      return Number(a.order || 0) - Number(b.order || 0);
    });

  const activeCarouselImages = (homeData.carouselImages || [])
    .filter((image) => image.isActive)
    .sort((a, b) => {
      return Number(a.order || 0) - Number(b.order || 0);
    });

  const getProductRating = (product) => {
    return Number(product.averageRating) || 4.5;
  };

  const ProductCard = ({ product }) => {
    return (
      <Link
        to={`/product/${product._id}`}
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <div className="card1">
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.productTitle}
            loading="lazy"
          />

          <h5>{product.productTitle}</h5>

          <div className="rating-icons">
            {Array.from({ length: 5 }, (_, index) => {
              const rating = getProductRating(product);
              const starNumber = index + 1;

              if (rating >= starNumber) {
                return <i key={index} className="bi bi-star-fill"></i>;
              }

              if (rating >= starNumber - 0.5) {
                return <i key={index} className="bi bi-star-half"></i>;
              }

              return <i key={index} className="bi bi-star"></i>;
            })}

            <span className="rating-number">
              {getProductRating(product).toFixed(1)}
            </span>
          </div>

          <h6>₹{product.offerPrice ? product.offerPrice : product.mrp}</h6>
        </div>
      </Link>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div
          style={{
            textAlign: "center",
            padding: "100px",
          }}
        >
          Loading...
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="home">
        <section>
          <div className="carousal-list">
            <div
              id="carouselExampleInterval"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                {activeCarouselImages.length > 0 ? (
                  activeCarouselImages.map((banner, index) => (
                    <div
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
                      data-bs-interval={index === 0 ? "10000" : "2000"}
                      key={banner._id}
                    >
                      {banner.link ? (
                        <Link to={banner.link}>
                          <img
                            src={getImageUrl(banner.image)}
                            className="d-block w-100"
                            alt={banner.title || "Banner"}
                          />
                        </Link>
                      ) : (
                        <img
                          src={getImageUrl(banner.image)}
                          className="d-block w-100"
                          alt={banner.title || "Banner"}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <>
                    <div
                      className="carousel-item active"
                      data-bs-interval="10000"
                    >
                      <a href="#">
                        <img
                          src="/images/carosouel7.webp"
                          className="d-block w-100"
                          alt="Fashion collection"
                        />
                      </a>
                    </div>

                    <div className="carousel-item" data-bs-interval="2000">
                      <a href="#">
                        <img
                          src="/images/carosouel8.webp"
                          className="d-block w-100"
                          alt="Fashion collection"
                        />
                      </a>
                    </div>

                    <div className="carousel-item">
                      <a href="#">
                        <img
                          src="/images/carosouel9.webp"
                          className="d-block w-100"
                          alt="Fashion collection"
                        />
                      </a>
                    </div>
                  </>
                )}
              </div>

              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleInterval"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon"></span>

                <span className="visually-hidden">Previous</span>
              </button>

              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleInterval"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon"></span>

                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="CustomerCareBenefits">
            <div className="benefits">
              <i className="bi bi-truck"></i>
              <h4>Free Shipping</h4>
            </div>

            <div className="benefits">
              <i className="bi bi-headphones"></i>
              <h4>24/7 Support</h4>
            </div>

            <div className="benefits">
              <i className="bi bi-arrow-repeat"></i>
              <h4>Money back</h4>
            </div>

            <div className="benefits">
              <i className="bi bi-gift-fill"></i>
              <h4>FREE COUPONS</h4>
            </div>
          </div>
        </section>

        <section>
          <div className="main-categories">
            <Link to="/collection">
              <img src="/images/cat1.webp" alt="" />
            </Link>

            <a href="#">
              <img src="/images/cat2.webp" alt="" />
            </a>
          </div>
        </section>

        <section>
          <div className="latest-collection">
            <div>
              <h4>Latest products</h4>

              <div className="p">
                <p>
                  "Explore the Latest Collection, Featuring Fresh Designs and
                  Bold Styles Crafted to{" "}
                </p>

                <p>Elevate Your Wardrobe for Every Occasion."</p>
              </div>
            </div>

            <div className="latest-collection-cards">
              {latestProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="category-head">
            <h3>Shop By Category</h3>
          </div>

          <div className="Category-list">
            <div className="cater-img">
              {categories.map((cat) => (
                <div className="cat-1" key={cat._id}>
                  <Link
                    to={`/collection?category=${cat._id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <img
                      src={getImageUrl(cat.categoryImage)}
                      alt={cat.categoryName}
                      loading="lazy"
                    />

                    <h4>{cat.categoryName}</h4>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="banner1">
            {activeHeroBanners.length > 0 ? (
              activeHeroBanners[0].buttonLink ? (
                <Link to={activeHeroBanners[0].buttonLink}>
                  <img
                    src={getImageUrl(activeHeroBanners[0].image)}
                    alt={activeHeroBanners[0].title || "Promotional Banner"}
                  />
                </Link>
              ) : (
                <img
                  src={getImageUrl(activeHeroBanners[0].image)}
                  alt={activeHeroBanners[0].title || "Promotional Banner"}
                />
              )
            ) : (
              <a href="#">
                <img
                  src="/images/Fashion Sale Banner.webp"
                  alt="Fashion Sale"
                />
              </a>
            )}
          </div>
        </section>

        <section>
          <div className="brand-head">
            <h3>Pick Your Preferred Brand</h3>
          </div>

          <div className="brand-img">
            {brands.map((brand) => (
              <Link to={`/collection?brand=${brand._id}`} key={brand._id}>
                <img
                  src={getImageUrl(brand.brandImage)}
                  alt={brand.brandName}
                  loading="lazy"
                />
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="coupens-section">
            <div className="coupens">
              {homeData.couponBanners.length > 0 ? (
                homeData.couponBanners.map((coupon) =>
                  coupon.link ? (
                    <Link to={coupon.link} key={coupon._id}>
                      <img
                        src={getImageUrl(coupon.image)}
                        alt={coupon.title || "Coupon"}
                      />
                    </Link>
                  ) : (
                    <img
                      key={coupon._id}
                      src={getImageUrl(coupon.image)}
                      alt={coupon.title || "Coupon"}
                    />
                  ),
                )
              ) : (
                <>
                  <img src="/images/coupen6.jpeg" alt="" />
                  <img src="/images/coupen8.jpeg" alt="" />
                  <img src="/images/coupen7.jpeg" alt="" />
                </>
              )}
            </div>
          </div>
        </section>

        {homeData.bestSellerActive && (
          <section>
            <div className="latest-collection">
              <div>
                <h4>Best Seller</h4>

                <div className="p">
                  <p>
                    "This top choice has earned its place at the top with its
                    unmatched versatility
                  </p>

                  <p>and consistent performance."</p>
                </div>
              </div>

              <div className="latest-collection-cards">
                {bestSellerProducts.length > 0 ? (
                  bestSellerProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <p>No best sellers available.</p>
                )}
              </div>
            </div>
          </section>
        )}

        <section>
          <div className="banner3">
            {activeCarouselImages.length > 1 ? (
              <>
                <div className="banner3-imgset1">
                  {activeCarouselImages.slice(1, 3).map((image, index) =>
                    image.link ? (
                      <Link to={image.link} key={image._id}>
                        <img
                          className={index === 0 ? "ban-img1" : "ban-img2"}
                          src={getImageUrl(image.image)}
                          alt={image.title || "Collection"}
                          loading="lazy"
                        />
                      </Link>
                    ) : (
                      <img
                        key={image._id}
                        className={index === 0 ? "ban-img1" : "ban-img2"}
                        src={getImageUrl(image.image)}
                        alt={image.title || "Collection"}
                        loading="lazy"
                      />
                    ),
                  )}
                </div>

                <div className="banner3-imgset2">
                  {activeCarouselImages.slice(3, 5).map((image, index) =>
                    image.link ? (
                      <Link to={image.link} key={image._id}>
                        <img
                          className={index === 0 ? "ban-img2" : "ban-img1"}
                          src={getImageUrl(image.image)}
                          alt={image.title || "Collection"}
                          loading="lazy"
                        />
                      </Link>
                    ) : (
                      <img
                        key={image._id}
                        className={index === 0 ? "ban-img2" : "ban-img1"}
                        src={getImageUrl(image.image)}
                        alt={image.title || "Collection"}
                        loading="lazy"
                      />
                    ),
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="banner3-imgset1">
                  <img className="ban-img1" src="/images/ban1.jpg" alt="" />

                  <img className="ban-img2" src="/images/ban6.webp" alt="" />
                </div>

                <div className="banner3-imgset2">
                  <img className="ban-img2" src="/images/ban7.webp" alt="" />

                  <img className="ban-img1" src="/images/ban2.jpg" alt="" />
                </div>
              </>
            )}
          </div>
        </section>

        <section>
          <div className="blog-section">
            <h4>
              Why Choose <span id="lavogue">LaVogue</span> for Your Shopping
              Needs?
            </h4>

            <p>
              "Discover the perfect blend of style, convenience, and confidence
              with LaVogue
            </p>

            <p>— your ultimate online shopping destination."</p>

            <div className="blog-section-cards">
              <div className="blog-img">
                <img src="/images/blog1.jpeg" alt="" loading="lazy" />

                <p>
                  We know how important it is to find the perfect fit when
                  shopping online. That’s why we offer comprehensive size guides
                  for every category, from clothes and shoes to accessories.
                  Whether you’re buying a cozy sweater or a sleek pair of boots,
                  you can easily match your measurements to our size charts to
                  ensure the perfect fit every time.
                </p>
              </div>

              <div className="blog-column">
                <div className="blog-img-1">
                  <p>
                    Our customers are always at the heart of everything we do.
                    That’s why we encourage you to read real customer reviews
                    before making a purchase. You’ll find honest feedback about
                    how each item fits, its quality, and how it looks in
                    everyday use. This way, you can feel confident knowing that
                    others just like you have shared their experiences.
                  </p>

                  <img src="/images/blog2.jpeg" alt="" loading="lazy" />
                </div>

                <div className="blog-img-1">
                  <img src="/images/blog3.jpeg" alt="" loading="lazy" />

                  <p>
                    At LaVogue, we believe in rewarding our loyal customers.
                    When you shop with us, you’ll gain access to exclusive
                    discounts, seasonal sales, and special promotions. Be sure
                    to subscribe to our newsletter so you can get the best deals
                    delivered straight to your inbox.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default Home;
