import React, { useEffect, useMemo, useState } from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";

import { Link, useSearchParams } from "react-router-dom";

import API, { getImageUrl } from "../../api";

function ProductGrid() {
  const [products, getproducts] = useState([]);

  const [sorting, setSorting] = useState("Default sorting");

  const [productLimit, setProductLimit] = useState("20");

  const [searchParams] = useSearchParams();

  const categoryId = searchParams.get("category");

  const brandId = searchParams.get("brand");

  useEffect(() => {
    const fetchproducts = async () => {
      try {
        const res = await API.get("/products");

        getproducts(res.data.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchproducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (categoryId) {
      result = result.filter((product) => product.category?._id === categoryId);
    }

    if (brandId) {
      result = result.filter((product) => product.brand?._id === brandId);
    }

    return result;
  }, [products, categoryId, brandId]);

  const displayedProducts = useMemo(() => {
    let result = [...filteredProducts];

    if (sorting === "Default sorting") {
      result = [...filteredProducts];
    }

    if (sorting === "sort by newness") {
      result.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();

        const dateB = new Date(b.createdAt || 0).getTime();

        return dateB - dateA;
      });
    }

    if (sorting === "Sort by popularity") {
      result.sort((a, b) => {
        const popularityA = Number(a.popularity || 0);

        const popularityB = Number(b.popularity || 0);

        return popularityB - popularityA;
      });
    }

    if (sorting === "Sort by average rating") {
      result.sort((a, b) => {
        const ratingA = Number(a.rating || 0);

        const ratingB = Number(b.rating || 0);

        return ratingB - ratingA;
      });
    }

    if (productLimit !== "All") {
      result = result.slice(0, Number(productLimit));
    }

    return result;
  }, [filteredProducts, sorting, productLimit]);

  const collectionQuery = new URLSearchParams();

  if (categoryId) {
    collectionQuery.set("category", categoryId);
  }

  if (brandId) {
    collectionQuery.set("brand", brandId);
  }

  const collectionPath = collectionQuery.toString()
    ? `/collection?${collectionQuery.toString()}`
    : "/collection";

  return (
    <>
      <Navbar />

      <div className="productgrid_page">
        <div className="main-container">
          {/* HEADER */}

          <div className="sub_container">
            <h3>COLLECTION</h3>

            <div className="sub1">
              <p>Home</p>

              <i className="bi bi-chevron-double-right"></i>

              <p>Collection</p>
            </div>
          </div>

          {/* SORT */}

          <div className="sub-container2">
            <div className="sort-div">
              <div className="grid-icons">
                <button>
                  <Link to="/collectiongrid">
                    <i className="bi bi-grid-3x3-gap-fill"></i>
                  </Link>
                </button>

                <button>
                  <Link to={collectionPath}>
                    <i className="bi bi-grid-1x2-fill"></i>
                  </Link>
                </button>
              </div>

              <div className="sort-list">
                <div className="sorting1">
                  <select
                    value={sorting}
                    onChange={(e) => setSorting(e.target.value)}
                  >
                    <option>Default sorting</option>

                    <option>Sort by popularity</option>

                    <option>Sort by average rating</option>

                    <option>sort by newness</option>
                  </select>
                </div>

                <div className="sorting2">
                  <select
                    value={productLimit}
                    onChange={(e) => setProductLimit(e.target.value)}
                  >
                    <option>20</option>
                    <option>30</option>
                    <option>40</option>
                    <option>All</option>
                  </select>
                </div>
              </div>

              <div className="sort-p">
                <p>Showing {displayedProducts.length} sorted products</p>
              </div>
            </div>
          </div>

          {/* PRODUCTS */}

          <div className="section">
            <div className="collection-section">
              {displayedProducts.length > 0 ? (
                Array.from({
                  length: Math.ceil(displayedProducts.length / 4),
                }).map((_, rowIndex) => (
                  <div className="latest-collection-cards" key={rowIndex}>
                    {displayedProducts
                      .slice(rowIndex * 4, rowIndex * 4 + 4)
                      .map((pro) => (
                        <Link
                          to={`/product/${pro._id}`}
                          key={pro._id}
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                          }}
                        >
                          <div className="card1">
                            <img
                              src={getImageUrl(pro.images?.[0])}
                              alt={pro.productTitle}
                            />

                            <h5>{pro.productTitle}</h5>

                            <div className="rating-icons">
                              <i className="bi bi-star-fill"></i>

                              <i className="bi bi-star-fill"></i>

                              <i className="bi bi-star-fill"></i>

                              <i className="bi bi-star-fill"></i>

                              <i className="bi bi-star-half"></i>
                            </div>

                            <h6>${pro.offerPrice || pro.mrp}</h6>
                          </div>
                        </Link>
                      ))}
                  </div>
                ))
              ) : (
                <div className="noproducts">
                  <h5>No products found...</h5>
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

export default ProductGrid;
