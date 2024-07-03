import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./config/router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./hooks/useAuth";

function App() {
  return (
    <GoogleOAuthProvider clientId="your_google_client_id">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
