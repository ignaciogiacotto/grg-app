import { createBrowserRouter, Navigate } from "react-router-dom";
import { UserApp } from "../components/UserApp";
import { User } from "../components/user/User";
import { UserForm } from "../components/user-form/UserForm";
import { Auth } from "../components/auth/Auth";
import { Forbidden403 } from "../components/forbidden403/Forbidden403";
import { ProtectedRoute } from "./ProtectedRoutes";
import CierrePf from "../components/cierre-pf/CierrePf";
import CierrePfHistory from "../components/cierre-pf/CierrePfHistory";
import { CierreKioscoForm } from "../components/cierre-kiosco/CierreKioscoForm";
import { CierreKioscoHistory } from "../components/cierre-kiosco/CierreKioscoHistory";
import Providers from "../components/providers/Providers";
import { CalculatorPage } from "../components/calculator/CalculatorPage";
import Extractions from "../components/extractions/Extractions";
import Dashboard from "../components/dashboard/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <UserApp />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "users",
        element: <User />,
      },
      {
        path: "users/page/:page",
        element: <User />,
      },
      {
        path: "users/create",
        element: <UserForm />,
      },
      {
        path: "users/edit/:id",
        element: <UserForm />,
      },
      {
        path: "login",
        element: <Auth />,
      },
      {
        path: "forbidden",
        element: <Forbidden403 />,
      },
      {
        element: <ProtectedRoute />, // Rutas solo para usuarios autenticados
        children: [
          {
            path: "/calculator",
            element: <CalculatorPage />,
          },
          {
            path: "/extractions",
            element: <Extractions />,
          },
        ],
      },
      {
        element: (
          <ProtectedRoute
            allowedRoles={["role_admin", "role_manager", "role_employee"]}
          />
        ),
        children: [
          {
            path: "/cierre-pf",
            element: <CierrePf />,
          },
          {
            path: "/cierre-pf/edit/:id",
            element: <CierrePf />,
          },
          {
            path: "/cierre-pf/history",
            element: <CierrePfHistory />,
          },
          {
            path: "/cierre-kiosco",
            element: <CierreKioscoForm />,
          },
          {
            path: "/cierre-kiosco/edit/:id",
            element: <CierreKioscoForm />,
          },
          {
            path: "/cierre-kiosco/history",
            element: <CierreKioscoHistory />,
          },
          {
            path: "/providers",
            element: <Providers />,
          },
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
]);
