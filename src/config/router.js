import { createBrowserRouter, Navigate } from "react-router-dom";
import { Home } from "../pages/Home";
import { Register } from "../components/auth/Register";
import { Login } from "../components/auth/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import { fetchUser } from "../hooks/useAuth";
import Restaurant from "../components/restaurant/Restaurant";
import Cart from "../components/cart/Cart";
import Checkout from "../components/checkout/Checkout";

const userLoader = async () => {
  const user = await fetchUser();
  return { user };
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "protected",
    element: <ProtectedRoute />,
    loader: userLoader,
    children: [
      { path: "home", element: <Home /> },
      { path: "restaurant/:id", element: <Restaurant /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
    ],
  },
]);
