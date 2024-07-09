import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./config/router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./hooks/useAuth";
import { CartProvider } from "./components/context/cartContext";

function App() {
  return (
    <GoogleOAuthProvider clientId="123">
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
