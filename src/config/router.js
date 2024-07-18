import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { Home } from "../pages/home/Home";
import { Register } from "../pages/auth/Register";
import { Login } from "../pages/auth/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import { fetchUser } from "../hooks/useAuth";
import Restaurant from "../pages/restaurant/Restaurant";
import Cart from "../pages/cart/Cart";
import Checkout from "../pages/checkout/Checkout";
import Header from "../components/Header";

const userLoader = async () => {
  const user = await fetchUser();
  return { user };
};

const ProtectedLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

export const router = createBrowserRouter([
  {
    index: true,
    element: <Login />,
  },
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
    path: "/",
    element: <ProtectedRoute />,
    loader: userLoader,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          { path: "home", element: <Home /> },
          { path: "restaurant/:id", element: <Restaurant /> },
          { path: "cart", element: <Cart /> },
          { path: "checkout", element: <Checkout /> },
        ],
      },
    ],
  },
]);
