import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Button, Alert } from "react-bootstrap";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../hooks/useAuth";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(
        "http://localhost:5002/api/users/login",
        values
      );
      localStorage.setItem("token", response.data.token);
      console.log(response.data.token);
      setMessage("Login successful!");
      setShowMessage(true);
      login(response.data);
      setSubmitting(false);
      navigate("/home");
    } catch (error) {
      setMessage("Invalid credentials");
      setShowMessage(true);
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await axios.post(
        "https://restaurantfullstack-20d2bcfb0f21.herokuapp.com/api/users/auth/google",
        {
          tokenId: response.credential,
        }
      );
      localStorage.setItem("token", res.data.token);
      setMessage("Login successful!");
      setShowMessage(true);
      navigate("/");
    } catch (error) {
      setMessage("Google authentication failed");
      setShowMessage(true);
    }
  };

  return (
    <Container>
      <h1>Login</h1>
      {showMessage && <Alert variant="info">{message}</Alert>}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <Field type="email" name="email" className="form-control" />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" className="form-control" />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger"
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              Login
            </Button>
          </Form>
        )}
      </Formik>
      <div className="mt-3">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            setMessage("Google authentication failed");
            setShowMessage(true);
          }}
        />
      </div>
      <div className="mt-3">
        <Button variant="link" onClick={() => navigate("/register")}>
          Don't have an account? Register here
        </Button>
      </div>
    </Container>
  );
};
