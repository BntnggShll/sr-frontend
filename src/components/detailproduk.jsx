import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DetailProduct = () => {
  const { productId } = useParams(); // Mendapatkan productId dari URL
  const [product, setProduct] = useState(null);
  const [currentStock, setCurrentStock] = useState(0); // Inisialisasi stock
  const [showStock, setShowStock] = useState(false);
  const navigate = useNavigate(); // Hook untuk navigasi

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/products/${productId}`
        );
        setProduct(response.data);
        setCurrentStock(response.data.stock); // Set nilai stok berdasarkan data produk
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) {
    return <p>Loading product details...</p>;
  }

  const handleIncrease = () => {
    if (currentStock < product.stock) {
      setCurrentStock(currentStock + 1); // Menambah stok
    }
  };

  const handleDecrease = () => {
    if (currentStock > 0) {
      setCurrentStock(currentStock - 1); // Mengurangi stok
    }
  };

  const handleBuyNow = () => {
    // Arahkan ke halaman cart dengan mengirimkan data product_id dan stock
    navigate("/cart", {
      state: { productId: product.product_id, name:product.name, stock: currentStock , price:product.price},
    });
  };

  return (
    <div
      id="detail"
      style={{
        backgroundColor: "#0b161a",
        color: "#d7843e",
        display: "flex",
        height: "100%",
        alignItems: "center",
      }}
    >
      <div>
        <img
          src={product.image}
          alt={product.name}
          className="img-fluid"
          style={{ height: "400px", width: "400px", marginLeft: "250px" }}
        />
      </div>
      <div style={{ marginLeft: "100px" }}>
        <p style={{ textTransform: "uppercase" ,fontSize:"40px" ,fontWeight:"bold",marginBottom:"-15px",marginTop:"-15px"}}>{product.name}</p>
        <p style={{ color: "white" }}>
          <strong>Price:</strong> ${product.price}
        </p>
        <p
          style={{
            color: "#6D6D6D",
            wordWrap: "break-word", // Mengganti dari wordBreak ke wordWrap
          }}
        >
          <span>
            <strong>Description:</strong>{" "}
          </span>
          <span
            style={{
              display: "inline-block", // Membuat width berlaku
              width: "550px",
              maxHeight: "250px",
              overflow: "auto", // Scroll jika konten terlalu besar
            }}
          >
            {product.description}
          </span>
        </p>

        <div style={{ display: "flex" }}>
          {/* Tombol untuk mengurangi stok */}
          <button
            style={{
              marginRight: "20px",
              height: "30px",
              width: "50px",
              border: "none",
              backgroundColor: "#D7843E",
              color: "white",
            }}
            onClick={handleDecrease}
          >
            -
          </button>

          {/* Menampilkan nilai stok saat ini */}
          <span
            style={{
              fontSize: "18px",
              marginRight: "20px",
              alignSelf: "center",
            }}
          >
            {currentStock} / {product.stock}
          </span>

          {/* Tombol untuk menambah stok */}
          <button
            style={{
              height: "30px",
              width: "50px",
              border: "none",
              backgroundColor: "#D7843E",
              color: "white",
            }}
            onClick={handleIncrease}
          >
            +
          </button>

          <button
            style={{
              border: "none",
              borderRadius:"0px",
              backgroundColor: "#D7843E",
              color: "white",
              height: "30px",
              width: "100px",
              marginLeft:"20px"
            }}
            className="btn btn-primary"
            onClick={handleBuyNow} // Navigasi ke cart
          >
            Buy Now!
          </button>

          {/* Menampilkan stok setelah tombol diklik */}
          {showStock && currentStock > 0 && (
            <p style={{ marginTop: "10px", fontSize: "18px" }}>
              Remaining Stock: {currentStock}
            </p>
          )}
          {currentStock === 0 && showStock && (
            <p style={{ marginTop: "10px", fontSize: "18px", color: "red" }}>
              Stock is out!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
