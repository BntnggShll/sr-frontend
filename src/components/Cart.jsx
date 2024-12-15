import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const location = useLocation();
  const { productId, stock, price, name } = location.state || {};
  const [product, setProduct] = useState(null); // Mengambil data dari state
  const [cartItems, setCartItems] = useState([]);
  const [currentStock, setCurrentStock] = useState(stock || 0);
  const navigate = useNavigate();

  // Load cart dari sessionStorage ketika komponen dimount
  useEffect(() => {
    const storedCart = sessionStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

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

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Tambahkan item ke cart ketika ada data baru dari location.state
  useEffect(() => {
    if (productId && stock && price && name) {
      const newCartItems = [
        ...cartItems,
        { productId, stock, price, total: stock * price, name },
      ];
      setCartItems(newCartItems);
    }
  }, [productId, stock, price, name]);

  // Sinkronkan cartItems ke sessionStorage setiap kali berubah
  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Fungsi untuk menghapus item dari cart
  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
  };

  const handleIncrease = (index) => {
    // Ambil item yang sesuai berdasarkan index
    const selectedItem = cartItems[index];

    // Validasi: Pastikan stok tidak melebihi stok produk yang tersedia
    if (selectedItem.stock < product.stock) {
      // Perbarui cartItems dengan stok yang ditingkatkan
      const updatedCart = cartItems.map((item, i) =>
        i === index
          ? {
              ...item,
              stock: item.stock + 1,
              total: (item.stock + 1) * item.price,
            }
          : item
      );

      setCartItems(updatedCart);

      // Opsional: Update currentStock hanya untuk produk ini
      setCurrentStock((prevStock) => prevStock + 1);
    } else {
      console.warn("Stock limit reached!");
    }
  };

  const handleDecrease = (index) => {
    const updatedCart = cartItems.map((item, i) =>
      i === index && item.stock > 1
        ? {
            ...item,
            stock: item.stock - 1,
            total: (item.stock - 1) * item.price,
          }
        : item
    );
    setCartItems(updatedCart);
  };

  const handlepayment = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.total, 0);
    navigate("/payment", {
      state: {
        payable_type: "App\\Models\\Products",
        payable_id: productId,
        amount: totalAmount,
      },
    });
  };

  return (
    <div id="cart">
      <div>
        <h2>YOUR CART</h2>

        {cartItems.length > 0 ? (
          <div style={{ display: "flex" }}>
            <div id="tablecart">
              <table className="table">
                <thead>
                  <tr>
                    <th>Products</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>Rp{item.price}</td>
                      <td>
                        <div className="stock">
                          <button
                            style={{ marginLeft: "10px" }}
                            className="stockbutton"
                            onClick={() => handleDecrease(index)}
                          >
                            -
                          </button>
                          <p style={{ marginTop: "6px" }}>{item.stock}</p>
                          <button
                            className="stockbutton"
                            style={{ marginLeft: "10px" }}
                            onClick={() => handleIncrease(index)}
                          >
                            <strong>+</strong>
                          </button>
                        </div>
                      </td>
                      <td>
                        Rp{item.total.toFixed(2)}
                        <button
                          onClick={() => removeItem(index)}
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            id="Layer_1"
                            data-name="Layer 1"
                            viewBox="0 0 24 24"
                            width="512"
                            height="512"
                            className="x"
                          >
                            <path d="m15.707,9.707l-2.293,2.293,2.293,2.293c.391.391.391,1.023,0,1.414-.195.195-.451.293-.707.293s-.512-.098-.707-.293l-2.293-2.293-2.293,2.293c-.195.195-.451.293-.707.293s-.512-.098-.707-.293c-.391-.391-.391-1.023,0-1.414l2.293-2.293-2.293-2.293c-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0l2.293,2.293,2.293-2.293c.391-.391,1.023-.391,1.414,0s.391,1.023,0,1.414Zm8.293,2.293c0,6.617-5.383,12-12,12S0,18.617,0,12,5.383,0,12,0s12,5.383,12,12Zm-2,0c0-5.514-4.486-10-10-10S2,6.486,2,12s4.486,10,10,10,10-4.486,10-10Z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <div className="summary">
                <p style={{ color: "#D7843E" }}>
                  <strong>Order Summary</strong>
                </p>
                <hr
                  style={{
                    backgroundColor: "#6D6D6D",
                    height: "2px",
                    width: "100%",
                  }}
                />
                <p>
                  Sub Total: Rp
                  {cartItems.reduce((sum, item) => sum + item.total, 0)}
                </p>
                <p style={{ color: "#D7843E" }}>Add subscriber coupon</p>
                <hr
                  style={{
                    backgroundColor: "#6D6D6D",
                    height: "2px",
                    width: "100%",
                  }}
                />
                <p>
                  <strong>
                    <span style={{ color: "#D7843E" }}>Total: </span>
                    <span style={{ color: "#000" }}>
                      Rp{cartItems.reduce((sum, item) => sum + item.total, 0)}
                    </span>
                  </strong>
                </p>
              </div>
              <div>
                <button className="checkout" onClick={handlepayment}>
                  CHECK OUT
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>No product added to the cart.</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
