import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Button, Alert } from "react-bootstrap";
import { GoogleLogin } from "@react-oauth/google";

export const Register = () => {
  const navigate = useNavigate();
  const [message, setMessage] = React.useState("");

  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(
        "https://restaurantfullstack-20d2bcfb0f21.herokuapp.com/api/users/register",
        values
      );
      console.log(response);
      setMessage("Account created successfully!");
      setSubmitting(false);
      navigate("/login");
    } catch (error) {
      setMessage("Error creating account: " + error.response.data.msg);
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await axios.post("/api/users/auth/google", {
        tokenId: response.credential,
      });
      localStorage.setItem("token", res.data.token);
      setMessage("Account created successfully with Google!");
      navigate("/");
    } catch (error) {
      setMessage("Google authentication failed");
    }
  };

  return (
    <Container>
      <h1>Register</h1>
      {message && <Alert variant="info">{message}</Alert>}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label htmlFor="name">Name</label>
              <Field type="text" name="name" className="form-control" />
              <ErrorMessage
                name="name"
                component="div"
                className="text-danger"
              />
            </div>
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
              Register
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
        <Button variant="link" onClick={() => navigate("/login")}>
          Already have an account? Login here
        </Button>
      </div>
    </Container>
  );
};
