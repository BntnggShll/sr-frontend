import React, { createContext, useReducer, useContext } from "react";

// Initial state
const initialState = {
  cartItems: [],
};

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.cartItems.find(
        (item) => item.productId === action.payload.productId
      );
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.productId === action.payload.productId
              ? {
                  ...item,
                  stock: item.stock + action.payload.stock,
                  total: (item.stock + action.payload.stock) * item.price,
                }
              : item
          ),
        };
      }
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (_, index) => index !== action.payload
        ),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        cartItems: state.cartItems.map((item, index) =>
          index === action.payload.index
            ? {
                ...item,
                stock: action.payload.newStock,
                total: action.payload.newStock * item.price,
              }
            : item
        ),
      };

    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use context
export const useCart = () => {
  return useContext(CartContext);
};
