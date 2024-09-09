import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useCart } from "../../context/cartContext";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth";
import { useRestaurant } from "../../context/restaurantContext";

const stripePromise = loadStripe(
  "pk_test_51PXxKbHEpkFeHCWbeU9HFQ16yy3jnLrZQodAUBxcSMchGxlW63daX7eRMGDLaBs3lgNGlC6T9njq9UL2nZLppbNi00sWfKwXMr"
);

const CheckoutForm = ({ restaurantId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { state } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");

  const { user } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const orderDetails = {
        userId: user.id,
        restaurantId,
        dishes: state.cartItems,
        address: { line1: address, city, state: stateField },
      };

      const { data } = await axios.post(
        "https://restaurantfullstack-20d2bcfb0f21.herokuapp.com/api/orders",
        orderDetails
      );

      const { clientSecret } = data;

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              address: {
                line1: address,
                city: city,
                state: stateField,
              },
            },
          },
        }
      );

      if (error) {
        setMessage(error.message);
      } else if (paymentIntent.status === "succeeded") {
        setMessage("Payment successful!");
      } else {
        setMessage("Payment processing.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Payment failed. Please try again.");
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
  const { restaurantId } = useRestaurant();
  return (
    <Elements stripe={stripePromise}>
      <div className="container mt-5">
        <h2>Checkout</h2>
        <CheckoutForm restaurantId={restaurantId} />
      </div>
    </Elements>
  );
};

export default Checkout;
