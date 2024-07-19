import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../../context/cartContext";
import { useRestaurant } from "../../context/restaurantContext";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  ListGroup,
  Alert,
  Form,
  InputGroup,
  FormControl,
} from "react-bootstrap";

const Restaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const { setRestaurantId } = useRestaurant();
  const { state, dispatch } = useCart();
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setRestaurantId(id);
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

  const removeFromCart = (dish) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: dish });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    dispatch({ type: "UPDATE_QUANTITY", payload: { _id: id, quantity } });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredDishes = restaurant
    ? restaurant.dishes.filter((dish) =>
        dish.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  if (!restaurant) return <div>Loading...</div>;

  return (
    <Container>
      <h1>{restaurant.name}</h1>
      <p>{restaurant.description}</p>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search for a dish..."
          value={search}
          onChange={handleSearch}
        />
      </Form.Group>

      <Row>
        {filteredDishes.map((dish) => {
          const cartItem = state.cartItems.find(
            (item) => item._id === dish._id
          );
          return (
            <Col md={4} key={dish._id}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>{dish.name}</Card.Title>
                  <Card.Text>${dish.price.toFixed(2)}</Card.Text>
                  {cartItem ? (
                    <div className="d-flex align-items-center">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => decrementQuantity(dish._id)}
                      >
                        -
                      </Button>
                      <InputGroup
                        size="sm"
                        className="mx-2"
                        style={{ width: "60px" }}
                      >
                        <FormControl
                          type="number"
                          value={cartItem.quantity}
                          onChange={(e) =>
                            updateQuantity(dish._id, parseInt(e.target.value))
                          }
                          min="1"
                        />
                      </InputGroup>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => incrementQuantity(dish._id)}
                      >
                        +
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="ml-2"
                        onClick={() => removeFromCart(dish)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <Button variant="primary" onClick={() => addToCart(dish)}>
                      Add to Cart
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
      <div className="cart-summary mt-4">
        <h5>Total: ${total.toFixed(2)}</h5>
        <Link to="/cart" className="btn btn-success">
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
