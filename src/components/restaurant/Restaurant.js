// src/components/restaurant/Restaurant.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCart } from "../context/cartContext";
import {
  Card,
  Accordion,
  Button,
  Container,
  Row,
  Col,
  Image,
} from "react-bootstrap";

const products = [
  { name: "Apples", country: "Italy", cost: 3, instock: 10 },
  { name: "Oranges", country: "Spain", cost: 4, instock: 3 },
  { name: "Beans", country: "USA", cost: 2, instock: 5 },
  { name: "Cabbage", country: "USA", cost: 1, instock: 8 },
];

const Restaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [items, setItems] = useState(products);
  const { state, dispatch } = useCart();

  useEffect(() => {
    axios
      .get(`http://localhost:5002/api/restaurants/${id}`)
      .then((response) => setRestaurant(response.data));
  }, [id]);

  if (!restaurant) return <div>Loading...</div>;

  const addToCart = (item) => {
    if (item.instock === 0) return;
    dispatch({ type: "ADD_TO_CART", payload: { ...item, quantity: 1 } });
    setItems(
      items.map((i) =>
        i.name === item.name ? { ...i, instock: i.instock - 1 } : i
      )
    );
  };

  const deleteCartItem = (item) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: item });
    setItems(
      items.map((i) =>
        i.name === item.name ? { ...i, instock: i.instock + 1 } : i
      )
    );
  };

  let list = items.map((item, index) => {
    let uhit = "https://picsum.photos/" + (1049 + index);
    return (
      <li key={index}>
        <Image src={uhit} width={70} roundedCircle />
        <Button variant="primary" size="large">
          {item.name}: ${item.cost} - Stock={item.instock}
        </Button>
        <input
          name={item.name}
          type="submit"
          value="Add to Cart"
          onClick={() => addToCart(item)}
        />
      </li>
    );
  });

  let cartList = state.cartItems.map((item, index) => {
    return (
      <Card key={index}>
        <Card.Header>
          <Accordion.Toggle as={Button} variant="link" eventKey={1 + index}>
            {item.name}
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse
          onClick={() => deleteCartItem(item)}
          eventKey={1 + index}
        >
          <Card.Body>
            $ {item.cost} from {item.country}
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  });

  let finalList = () => {
    let total = checkOut();
    let final = state.cartItems.map((item, index) => {
      return <div key={index}>{item.name}</div>;
    });
    return { final, total };
  };

  const checkOut = () => {
    let costs = state.cartItems.map((item) => item.cost);
    const reducer = (accum, current) => accum + current;
    let newTotal = costs.reduce(reducer, 0);
    console.log(`total updated to ${newTotal}`);
    return newTotal;
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>{restaurant.name}</h1>
          <p>{restaurant.description}</p>
          <ul style={{ listStyleType: "none" }}>{list}</ul>
        </Col>
        <Col>
          <h1>Cart Contents</h1>
          <Accordion>{cartList}</Accordion>
        </Col>
        <Col>
          <h1>CheckOut </h1>
          <Button onClick={checkOut}>CheckOut $ {finalList().total}</Button>
          <div> {finalList().total > 0 && finalList().final} </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Restaurant;
