import React from "react";
import { useLocation } from "react-router-dom";

const Cart = () => {
  const location = useLocation();
  const { productId, stock, price } = location.state || {}; // Mengambil data dari state

  // Menghitung total harga
  const total = stock * price;

  return (
    <div id="cart">
      <div>
        <h2>YOUR CART</h2>

        {productId && stock ? (
          <div>
            {/* Table for cart items */}
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Product {productId}</td>
                  <td>${price}</td>
                  <td>{stock}</td>
                  <td>${total}</td>
                </tr>
              </tbody>
            </table>

            {/* Order Summary Section */}
            <div>
              <p>
                <strong>Order Summary</strong>
              </p>
              <hr />
              <p>Sub Total: ${total}</p>
              <p>Add subscriber coupon</p>
              <hr />
              <p>
                <strong>Total: ${total}</strong>
              </p>
            </div>
          </div>
        ) : (
          <p>No product added to the cart.</p>
        )}

        {/* Checkout Button inside Order Summary column */}
        {productId && stock && (
          <div>
            <button>CHECK OUT</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
