import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useCart } from "../context/cartContext";
import { Button, Form, Row, Col } from "react-bootstrap";

const stripePromise = loadStripe(
  "pk_test_51PXxKbHEpkFeHCWbeU9HFQ16yy3jnLrZQodAUBxcSMchGxlW63daX7eRMGDLaBs3lgNGlC6T9njq9UL2nZLppbNi00sWfKwXMr"
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { state } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {
        address: {
          line1: address,
          city: city,
          state: stateField,
        },
      },
    });

    if (!error) {
      const { id } = paymentMethod;
      const orderDetails = {
        userId: "1",
        restaurantId: "66869b0a393b31faba596122",
        dishes: state.cartItems,
        token: id,
        address: { line1: address, city, state: stateField },
      };

      try {
        const response = await axios.post(
          "https://restaurantfullstack-20d2bcfb0f21.herokuapp.com/api/orders",
          orderDetails
        );
        console.log(response.data);
        setMessage("Payment successful!");
      } catch (err) {
        console.error(err);
        setMessage("Payment failed. Please try again.");
      }
    } else {
      console.error(error);
      setMessage(error.message);
    }
    setLoading(false);
  };

  return (
    <Form onSubmit={handleSubmit} className="p-4 shadow-sm rounded">
      <Form.Group as={Row} controlId="formHorizontalAddress">
        <Form.Label column sm={3}>
          Address
        </Form.Label>
        <Col sm={9}>
          <Form.Control
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="formHorizontalCity">
        <Form.Label column sm={3}>
          City
        </Form.Label>
        <Col sm={9}>
          <Form.Control
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="formHorizontalState">
        <Form.Label column sm={3}>
          State
        </Form.Label>
        <Col sm={9}>
          <Form.Control
            type="text"
            placeholder="State"
            value={stateField}
            onChange={(e) => setStateField(e.target.value)}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="formHorizontalCard">
        <Form.Label column sm={3}>
          Card Details
        </Form.Label>
        <Col sm={9}>
          <CardElement className="p-2 border rounded" />
        </Col>
      </Form.Group>

      <Button
        type="submit"
        disabled={!stripe || loading}
        className="mt-3 w-100"
      >
        {loading ? "Processing..." : "Pay"}
      </Button>
      {message && <div className="mt-3 text-center">{message}</div>}
    </Form>
  );
};

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <div className="container mt-5">
        <h2>Checkout</h2>
        <CheckoutForm />
      </div>
    </Elements>
  );
};

export default Checkout;
