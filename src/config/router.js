/*import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  defer,
} from "react-router-dom";
import { ProtectedLayout } from "../components/layout/ProtectedLayout";
import { Home } from "../components/home/Home";
import { Register } from "../components/auth/Register";
import { Login } from "../components/auth/Login";
import { Secret } from "../pages/Secret";
import { Verify2FA } from "../pages/Verify2FA";

const getUserData = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      const user = window.localStorage.getItem("user");
      resolve(user);
    }, 3000)
  );

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route loader={() => defer({ userPromise: getUserData() })}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<ProtectedLayout />}>
        <Route path="profile" element={<Secret />} />
        <Route path="settings" element={<Secret />} />
      </Route>
      <Route path="/verify-2fa" element={<Verify2FA />} />
    </Route>
  )
);

*/

import { createBrowserRouter, Navigate } from "react-router-dom";
import { Home } from "../components/home/Home";
import { Register } from "../components/auth/Register";
import { Login } from "../components/auth/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import { fetchUser } from "../hooks/useAuth";

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
    children: [{ path: "home", element: <Home /> }],
  },
]);
