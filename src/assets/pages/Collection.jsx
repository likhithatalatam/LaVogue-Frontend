import React, { useEffect, useMemo, useState } from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";

import { Link, useSearchParams } from "react-router-dom";

import API, { getImageUrl } from "../../api";

function Collection() {
  const [products, setproducts] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [search, setSearch] = useState("");

  const [searchParams] = useSearchParams();

  const categoryId = searchParams.get("category");

  const brandId = searchParams.get("brand");

  const searchQuery = searchParams.get("search");

  const [selectedCategory, setSelectedCategory] = useState(categoryId || "");

  const [selectedBrands, setSelectedBrands] = useState([]);

  const [selectedDiscount, setSelectedDiscount] = useState("");

  const [selectedColor, setSelectedColor] = useState("");

  const [selectedPrice, setSelectedPrice] = useState(0);

  const [sorting, setSorting] = useState("Default sorting");

  const [productLimit, setProductLimit] = useState("20");

  useEffect(() => {
    const fetchproducts = async () => {
      try {
        const res = await API.get("/products");

        setproducts(res.data.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchproducts();
  }, []);

  useEffect(() => {
    setSelectedCategory(categoryId || "");
  }, [categoryId]);

  useEffect(() => {
    setSearch(searchQuery || "");
  }, [searchQuery]);

  const getPrice = (product) => {
    return Number(product.mrp) || 0;
  };

  const minProductPrice = useMemo(() => {
    if (!products.length) {
      return 0;
    }

    const prices = products
      .map((product) => Number(product.mrp) || 0)
      .filter((price) => price > 0);

    if (!prices.length) {
      return 0;
    }

    return Math.min(...prices);
  }, [products]);

  const maxProductPrice = useMemo(() => {
    if (!products.length) {
      return 0;
    }

    return Math.max(...products.map((product) => Number(product.mrp) || 0));
  }, [products]);

  useEffect(() => {
    if (maxProductPrice > 0) {
      setSelectedPrice(maxProductPrice);
    }
  }, [maxProductPrice]);

  const categories = useMemo(() => {
    const categoryMap = {};

    products.forEach((product) => {
      const categoryId = product.category?._id;

      const categoryName = product.category?.categoryName;

      if (categoryId && categoryName) {
        if (!categoryMap[categoryId]) {
          categoryMap[categoryId] = {
            id: categoryId,
            name: categoryName,
            count: 0,
          };
        }

        categoryMap[categoryId].count++;
      }
    });

    return Object.values(categoryMap);
  }, [products]);

  const brands = useMemo(() => {
    const brandMap = {};

    products.forEach((product) => {
      const brandId = product.brand?._id;

      const brandName = product.brand?.brandName;

      if (brandId && brandName) {
        if (!brandMap[brandId]) {
          brandMap[brandId] = {
            id: brandId,
            name: brandName,
            count: 0,
          };
        }

        brandMap[brandId].count++;
      }
    });

    return Object.values(brandMap);
  }, [products]);

  const colors = useMemo(() => {
    const colorMap = {};

    products.forEach((product) => {
      if (product.color) {
        const color = String(product.color).trim();

        if (color) {
          if (!colorMap[color]) {
            colorMap[color] = 0;
          }

          colorMap[color]++;
        }
      }
    });

    return Object.entries(colorMap).map(([name, count]) => ({
      name,
      count,
    }));
  }, [products]);

  const discounts = useMemo(() => {
    const discountMap = {};

    products.forEach((product) => {
      const discount = Number(product.discount);

      if (!isNaN(discount) && discount > 0) {
        discountMap[discount] = true;
      }
    });

    return Object.keys(discountMap)
      .map(Number)
      .sort((a, b) => a - b);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (categoryId) {
      result = result.filter((product) => product.category?._id === categoryId);
    }

    if (brandId) {
      result = result.filter((product) => product.brand?._id === brandId);
    }

    if (search.trim()) {
      const searchText = search.toLowerCase().trim();

      result = result.filter((product) => {
        const title = product.productTitle?.toLowerCase() || "";

        const category = product.category?.categoryName?.toLowerCase() || "";

        const brand = product.brand?.brandName?.toLowerCase() || "";

        const color = product.color?.toLowerCase() || "";

        return (
          title.includes(searchText) ||
          category.includes(searchText) ||
          brand.includes(searchText) ||
          color.includes(searchText)
        );
      });
    }

    if (selectedCategory && selectedCategory !== categoryId) {
      result = result.filter(
        (product) => product.category?._id === selectedCategory,
      );
    }

    if (selectedBrands.length > 0) {
      result = result.filter((product) =>
        selectedBrands.includes(product.brand?.brandName),
      );
    }

    if (selectedDiscount) {
      const requiredDiscount = Number(selectedDiscount);

      result = result.filter((product) => {
        const productDiscount = Number(product.discount) || 0;

        return productDiscount >= requiredDiscount;
      });
    }

    if (selectedColor) {
      result = result.filter(
        (product) =>
          String(product.color || "").toLowerCase() ===
          selectedColor.toLowerCase(),
      );
    }

    if (selectedPrice > 0 && selectedPrice < maxProductPrice) {
      result = result.filter((product) => getPrice(product) <= selectedPrice);
    }

    if (sorting === "Sort by popularity") {
      result.sort((a, b) => {
        const popularityA = Number(a.popularity) || 0;

        const popularityB = Number(b.popularity) || 0;

        return popularityB - popularityA;
      });
    }

    if (sorting === "Sort by average rating") {
      result.sort((a, b) => {
        const ratingA = Number(a.rating) || 0;

        const ratingB = Number(b.rating) || 0;

        return ratingB - ratingA;
      });
    }

    if (sorting === "sort by newness") {
      result.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();

        const dateB = new Date(b.createdAt || 0).getTime();

        return dateB - dateA;
      });
    }

    if (productLimit !== "All") {
      result = result.slice(0, Number(productLimit));
    }

    return result;
  }, [
    products,
    search,
    categoryId,
    brandId,
    selectedCategory,
    selectedBrands,
    selectedDiscount,
    selectedColor,
    selectedPrice,
    maxProductPrice,
    sorting,
    productLimit,
  ]);

  const handleBrandChange = (brandName) => {
    setSelectedBrands((previousBrands) => {
      if (previousBrands.includes(brandName)) {
        return previousBrands.filter((brand) => brand !== brandName);
      }

      return [...previousBrands, brandName];
    });
  };

  const clearFilters = () => {
    setSearch("");

    setSelectedCategory(categoryId || "");

    setSelectedBrands([]);

    setSelectedDiscount("");

    setSelectedColor("");

    setSelectedPrice(maxProductPrice);

    setSorting("Default sorting");

    setProductLimit("20");
  };

  const gridQuery = new URLSearchParams();

  if (categoryId) {
    gridQuery.set("category", categoryId);
  }

  if (brandId) {
    gridQuery.set("brand", brandId);
  }

  const gridPath = gridQuery.toString()
    ? `/collectiongrid?${gridQuery.toString()}`
    : "/collectiongrid";

  return (
    <>
      <Navbar />

      <div className="productpage">
        <div className="main-container">
          <div className="sub_container">
            <h3>COLLECTION</h3>

            <div className="sub1">
              <p>Home</p>

              <i className="bi bi-chevron-double-right"></i>

              <p>Collection</p>
            </div>
          </div>

          <div className="sub-container2">
            <div className="mobile-filter-bar">
              <button
                className="mobile-filter-button"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <i className="bi bi-sliders"></i>
                <span>FILTER</span>
              </button>

              <div className="mobile-filter-count">
                {filteredProducts.length} products
              </div>
            </div>
            <div className="sort-div">
              <div className="grid-icons">
                <button>
                  <Link to={gridPath}>
                    <i className="bi bi-grid-3x3-gap-fill"></i>
                  </Link>
                </button>

                <button>
                  <Link
                    to={
                      categoryId
                        ? `/collection?category=${categoryId}`
                        : brandId
                          ? `/collection?brand=${brandId}`
                          : "/collection"
                    }
                  >
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
                <p>Showing {filteredProducts.length} sorted products</p>
              </div>
            </div>
          </div>

          <div className="section">
            <div
              className={`div-list ${
                showMobileFilters ? "mobile-filters-open" : ""
              }`}
            >
              {/* SEARCH */}

              <div className="div1">
                <h5>SEARCH</h5>

                <hr />

                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* PRICE */}

              <div className="div2">
                <h5>
                  PRICE FILTER{" "}
                  <span>
                    ₹{minProductPrice} - ₹{selectedPrice || maxProductPrice}
                  </span>
                </h5>

                <hr />

                <input
                  type="range"
                  min={minProductPrice}
                  max={maxProductPrice}
                  value={selectedPrice || maxProductPrice}
                  onChange={(e) => setSelectedPrice(Number(e.target.value))}
                />
              </div>

              {/* CATEGORIES */}

              <div className="category-div">
                <h5>CATEGORIES</h5>

                <hr />

                {categories.map((category) => (
                  <div
                    className="categories1"
                    key={category.id}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === category.id ? "" : category.id,
                      )
                    }
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <p>{category.name}</p>

                    <p>({category.count})</p>
                  </div>
                ))}
              </div>

              {/* BRANDS */}

              <div className="brand-div">
                <h5>BRANDS</h5>

                <hr />

                {brands.map((brand) => (
                  <div className="brand" key={brand.id}>
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.name)}
                      onChange={() => handleBrandChange(brand.name)}
                    />

                    <label>{brand.name}</label>
                  </div>
                ))}
              </div>

              {/* DISCOUNT */}

              <div className="discount-div">
                <h5>DISCOUNT</h5>

                <hr />

                {discounts.map((discount) => (
                  <div className="discount" key={discount}>
                    <input
                      type="radio"
                      name="discount"
                      checked={selectedDiscount === String(discount)}
                      onChange={() => setSelectedDiscount(String(discount))}
                    />

                    <label>{discount}% and above</label>
                  </div>
                ))}
              </div>

              {/* COLORS */}

              <div className="discount-div">
                <h5>COLOR</h5>

                <hr />

                {colors.map((color) => (
                  <div className="discount" key={color.name}>
                    <input
                      type="radio"
                      name="color"
                      checked={
                        selectedColor.toLowerCase() === color.name.toLowerCase()
                      }
                      onChange={() => setSelectedColor(color.name)}
                    />

                    <label>{color.name}</label>
                  </div>
                ))}
              </div>

              {/* CLEAR */}

              <div className="discount-div">
                <button onClick={clearFilters}>Clear Filters</button>
              </div>
            </div>

            {/* PRODUCTS */}

            <div>
              {filteredProducts.length > 0 ? (
                <div className="latest-collection-cards">
                  {filteredProducts.map((pro) => (
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

export default Collection;
