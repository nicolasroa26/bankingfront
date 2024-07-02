import React, { useState, useEffect } from "react";
import axios from "axios";

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get("/api/cart").then((response) => setCart(response.data));
  }, []);

  const handleRemove = (dishId) => {
    axios
      .delete(`/api/cart/${dishId}`)
      .then((response) => setCart(response.data));
  };

  const handleQuantityChange = (dishId, quantity) => {
    const updatedCart = cart.map((item) => {
      if (item.dishId === dishId) {
        return { ...item, quantity };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="container">
      <h1>Cart</h1>
      <div className="row">
        {cart.map((item) => (
          <div className="col-md-4" key={item.dishId}>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">${item.price.toFixed(2)}</p>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.dishId, parseInt(e.target.value))
                  }
                  className="form-control"
                />
                <button
                  className="btn btn-danger mt-2"
                  onClick={() => handleRemove(item.dishId)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <h3>Total: ${totalAmount.toFixed(2)}</h3>
      <button className="btn btn-success">Checkout</button>
    </div>
  );
};

export default Cart;
