import React from "react";
import { useCart } from "../context/cartContext";
import { Link } from "react-router-dom";
import {
  Button,
  Container,
  ListGroup,
  ListGroupItem,
  InputGroup,
  FormControl,
} from "react-bootstrap";

const Cart = () => {
  const { state, dispatch } = useCart();

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { _id: id } });
  };

  const decrementQuantity = (id) => {
    const item = state.cartItems.find((item) => item._id === id);
    if (item.quantity === 1) {
      removeFromCart(id);
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { _id: id, quantity: item.quantity - 1 },
      });
    }
  };

  const incrementQuantity = (id) => {
    const item = state.cartItems.find((item) => item._id === id);
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { _id: id, quantity: item.quantity + 1 },
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    dispatch({ type: "UPDATE_QUANTITY", payload: { _id: id, quantity } });
  };

  return (
    <Container>
      <h2 className="my-4">Cart</h2>
      <ListGroup>
        {state.cartItems.map((item) => (
          <ListGroupItem
            key={item._id}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <h5>{item.name}</h5>
              <p>
                ${item.price.toFixed(2)} x {item.quantity}
              </p>
            </div>
            <div className="d-flex align-items-center">
              <Button
                variant="danger"
                size="sm"
                onClick={() => decrementQuantity(item._id)}
              >
                -
              </Button>
              <InputGroup size="sm" className="mx-2" style={{ width: "60px" }}>
                <FormControl
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item._id, parseInt(e.target.value))
                  }
                  min="1"
                />
              </InputGroup>
              <Button
                variant="success"
                size="sm"
                onClick={() => incrementQuantity(item._id)}
              >
                +
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="ml-2"
                onClick={() => removeFromCart(item._id)}
              >
                Remove
              </Button>
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
      <h4 className="mt-4">
        Total: $
        {state.cartItems
          .reduce((total, item) => total + item.price * item.quantity, 0)
          .toFixed(2)}
      </h4>
      <div className="mt-4 d-flex justify-content-between">
        <Link to="/protected/home">
          <Button variant="secondary">Back to Restaurants</Button>
        </Link>
        <Link to="/protected/checkout">
          <Button variant="primary">Proceed to Checkout</Button>
        </Link>
      </div>
    </Container>
  );
};

export default Cart;
