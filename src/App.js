import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./config/router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./hooks/useAuth";
import { CartProvider } from "./context/cartContext";
import { RestaurantProvider } from "./context/restaurantContext";

function App() {
  return (
    <GoogleOAuthProvider clientId="974308017877-73jq35f1j3ndg8cvg0344nsimh2vbaij.apps.googleusercontent.com">
      <AuthProvider>
        <RestaurantProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </RestaurantProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
