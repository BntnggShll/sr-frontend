import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Cart = () => {
  const location = useLocation();
  const { productId, stock, price } = location.state || {}; // Mengambil data dari state
  const [cartItems, setCartItems] = useState([]);

  // Load cart dari sessionStorage ketika komponen dimount
  useEffect(() => {
    const storedCart = sessionStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Tambahkan item ke cart ketika ada data baru dari location.state
  useEffect(() => {
    if (productId && stock && price) {
      const newCartItems = [
        ...cartItems,
        { productId, stock, price, total: stock * price },
      ];
      setCartItems(newCartItems);
    }
  }, [productId, stock, price]);

  // Sinkronkan cartItems ke sessionStorage setiap kali berubah
  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Fungsi untuk menghapus item dari cart
  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
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
                      <td>Product {item.productId}</td>
                      <td>${item.price}</td>
                      <td>{item.stock}</td>
                      <td>
                        ${item.total}
                        <button onClick={() => removeItem(index)} style={{backgroundColor:"transparent",border:"none"}}>
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
                Sub Total: $
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
          </div>
        ) : (
          <p>No product added to the cart.</p>
        )}

        {/* Checkout Button */}
        {cartItems.length > 0 && (
          <div>
            <button>CHECK OUT</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
