import React from "react";
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
  const [message, setMessage] = React.useState("");

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
      setMessage("Login successful!");
      login(response.data);
      setSubmitting(false);
      navigate("/protected/home");
    } catch (error) {
      setMessage("Invalid credentials");
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await axios.post(
        "http://localhost:5002/api/users/auth/google",
        {
          tokenId: response.credential,
        }
      );
      localStorage.setItem("token", res.data.token);
      setMessage("Login successful!");
      navigate("/");
    } catch (error) {
      setMessage("Google authentication failed");
    }
  };

  return (
    <Container>
      <h1>Login</h1>
      {message && <Alert variant="info">{message}</Alert>}
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
          onError={() => setMessage("Google authentication failed")}
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
