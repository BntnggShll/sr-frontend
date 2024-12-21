import { useEffect, useState } from "react";
import axios from 'axios';
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); 
  const [currentPage, setCurrentPage] = useState(0); 
  const productsPerPage = 3; 

  // Mengambil data dari API
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/products`)
      .then(response => {
        if (response.data.success) {
          setProducts(response.data.product);
        } else {
          console.error("Failed to fetch products");
        }
      })
      .catch(error => {
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

  const handleBuyNow = (productId, stock, price, name) => {
    // Arahkan ke halaman cart dengan mengirimkan data product_id, stock, dan price
    navigate("/cart", {
      state: { productId, stock, price ,name},
    });
  };

  return (
    <div>
      <div id="product">
        <div className="container">
          <div className="section-title">
            <h2><span>Our</span> <span>Products</span></h2>
          </div>
          <div className="row">
            {currentProducts.map((product, index) => (
              <div 
                key={product.product_id } 
                className={`col-md-4  ${index % 2 === 0 ? 'even-class' : 'odd-class'}`}>
                <div className="product-item">
                <Link to={`/product/${product.product_id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="img-fluid"
                    />
                  </Link>
                  <a href="" onClick={() =>
                      handleBuyNow(product.product_id, 1, product.price ,product.name)
                    }><button className="btn">{product.name}</button></a>
                </div>
              </div>
            ))}
          </div>

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