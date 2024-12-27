import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const location = useLocation();
  const { productId, stock, price, name } = location.state || {};
  const [products, setProducts] = useState([]);
  const [Id, setID] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Load cart dari sessionStorage ketika komponen dimount
  useEffect(() => {
    const storedCart = sessionStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Mengambil semua produk dari database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Tambahkan item ke cart ketika ada data baru dari location.state
  useEffect(() => {
    if (productId && stock && price && name) {
      const storedCart = sessionStorage.getItem("cart");
      const parsedCart = storedCart ? JSON.parse(storedCart) : [];
      const existingProductIndex = parsedCart.findIndex(item => item.productId === productId);

      if (existingProductIndex === -1) {
        // Jika productId belum ada, tambah item baru
        parsedCart.push({ productId, stock, price, total: stock * price, name });
        setCartItems(parsedCart);
        sessionStorage.setItem("cart", JSON.stringify(parsedCart));
        navigate(location.state, { replace: true, state: {} });
      }
    }
  }, [productId, stock, price, name]);

  // Fungsi untuk menghapus item dari cart
  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Fungsi untuk menambah jumlah produk
  const handleIncrease = (index) => {
    const selectedItem = cartItems[index];
    const product = products.product.find((p) => p.product_id === selectedItem.productId);

    if (product && selectedItem.stock < product.stock) {
      const updatedCart = cartItems.map((item, i) =>
        i === index
          ? { ...item, stock: item.stock + 1, total: (item.stock + 1) * item.price }
          : item
      );

      setCartItems(updatedCart);
      sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      toast.warn("Stock limit reached!");
    }
  };

  // Fungsi untuk mengurangi jumlah produk
  const handleDecrease = (index) => {
    const updatedCart = cartItems.map((item, i) =>
      i === index && item.stock > 1
        ? { ...item, stock: item.stock - 1, total: (item.stock - 1) * item.price }
        : item
    );
    setCartItems(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };


  const handlePayment = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
  
    const cart = sessionStorage.getItem("cart");
    if (cart) {
      try {
        const parsedCart = JSON.parse(cart);
  
        // Mengupdate stok untuk setiap item dalam cart
        parsedCart.forEach((item) => {
          axios
            .put(`${process.env.REACT_APP_API_URL}/stock/${item.productId}`, {
              stock: item.stock,
            })
        });
        navigate("/payment", {
          state: {
            payable_type: "App\\Models\\Products",
            payable_id: parsedCart.map((item) => item.productId), // Mengambil semua productId
            amount: parsedCart.map((item) => item.price * item.stock),
          },
        });
      } catch (error) {
        console.error("Error parsing cart data:", error);
        toast.error("Failed to process your cart. Please try again.");
      }
    } else {
      toast.error("Cart is empty or invalid!");
    }
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
                <button className="checkout" onClick={handlePayment}>
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
