import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import React from "react";

export const Product = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 3;
  const navigate = useNavigate();

  // Mengambil data dari API
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products`)
      .then((response) => {
        if (response.data.success) {
          setProducts(response.data.product);
        } else {
          console.error("Failed to fetch products");
        }
      })
      .catch((error) => {
        console.error("Error fetching products", error);
      });
  }, []);

  // Menghitung batas bawah dan atas untuk slice
  const startIndex = currentPage * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  // Fungsi untuk ke halaman berikutnya
  const nextPage = () => {
    if (endIndex < products.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Fungsi untuk ke halaman sebelumnya
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleBuyNow = (productId, stock, price) => {
    // Arahkan ke halaman cart dengan mengirimkan data product_id, stock, dan price
    navigate("/cart", {
      state: { productId, stock, price },
    });
  };

  return (
    <div>
      <div id="product">
        <div className="container">
          <div className="section-title">
            <h2>
              <span>Our</span> <span>Products</span>
            </h2>
          </div>
          <div className="row">
            {currentProducts.map((product) => (
              <div key={product.product_id} className="col-md-4">
                <div className="product-item">
                  {/* Link ke halaman detail produk */}
                  <Link to={`/product/${product.product_id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="img-fluid"
                    />
                  </Link>
                  {/* Tombol Buy Now */}
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() =>
                      handleBuyNow(product.product_id, 1, product.price)
                    }
                  >
                    Buy Now!
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Navigasi Pagination */}
          <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 0}>
              Previous
            </button>
            <button onClick={nextPage} disabled={endIndex >= products.length}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
