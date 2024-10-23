import { useEffect, useState } from "react";
import axios from 'axios';
import React from "react";

export const Product = () => {
  const [products, setProducts] = useState([]); 
  const [currentPage, setCurrentPage] = useState(0); 
  const productsPerPage = 3; 

  // Mengambil data dari API
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/service`)
      .then(response => {
        if (response.data.success) {
          setProducts(response.data.data);
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
                key={product.id} 
                className={`col-md-4  ${index % 2 === 0 ? 'even-class' : 'odd-class'}`}>
                <div className="product-item">
                  <img src={product.image} alt={product.name} className="img-fluid" />
                  <a href=""><button className="btn">{product.price}</button></a>
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
