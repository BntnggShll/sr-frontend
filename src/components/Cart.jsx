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
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td>Product {item.productId}</td>
                      <td>${item.price}</td>
                      <td>{item.stock}</td>
                      <td>${item.total}</td>
                      <td>
                        <button onClick={() => removeItem(index)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <p>
                <strong>Order Summary</strong>
              </p>
              <hr />
              <p>
                Sub Total: $
                {cartItems.reduce((sum, item) => sum + item.total, 0)}
              </p>
              <p>Add subscriber coupon</p>
              <hr />
              <p>
                <strong>
                  Total: $
                  {cartItems.reduce((sum, item) => sum + item.total, 0)}
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
