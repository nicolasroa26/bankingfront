import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/cartContext";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  ListGroup,
  Alert,
} from "react-bootstrap";
const Restaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const { state, dispatch } = useCart();
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(
          `https://restaurantfullstack-20d2bcfb0f21.herokuapp.com/api/restaurants/${id}`
        );
        setRestaurant(response.data);
      } catch (err) {
        setError("Failed to fetch restaurant data");
      }
    };
    fetchRestaurant();
  }, [id]);

  useEffect(() => {
    const newTotal = state.cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(newTotal);
  }, [state.cartItems]);

  const addToCart = (dish) => {
    dispatch({ type: "ADD_TO_CART", payload: { ...dish, quantity: 1 } });
  };

  const removeFromCart = (dish) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: dish });
  };

  if (!restaurant) return <div>Loading...</div>;

  return (
    <Container>
      <h1>{restaurant.name}</h1>
      <p>{restaurant.description}</p>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        {restaurant.dishes.map((dish) => {
          const cartItem = state.cartItems.find(
            (item) => item._id === dish._id
          );
          return (
            <Col md={4} key={dish._id}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>{dish.name}</Card.Title>
                  <Card.Text>${dish.price.toFixed(2)}</Card.Text>
                  <Button variant="primary" onClick={() => addToCart(dish)}>
                    Add to Cart
                  </Button>
                  {cartItem && (
                    <div className="mt-2">
                      <Button
                        variant="danger"
                        onClick={() => removeFromCart(dish)}
                      >
                        Remove from Cart
                      </Button>
                      <span className="ml-2">
                        Quantity: {cartItem.quantity}
                      </span>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
      <div className="cart-summary mt-4">
        <h5>Total: ${total.toFixed(2)}</h5>
        <Link to="/protected/cart" className="btn btn-success">
          Go to Cart
        </Link>
      </div>
      <div className="selected-items mt-4">
        <h5>Selected Items:</h5>
        <ListGroup>
          {state.cartItems.map((item) => (
            <ListGroup.Item key={item._id}>
              {item.name} - Quantity: {item.quantity}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </Container>
  );
};

export default Restaurant;
