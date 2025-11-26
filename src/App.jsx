import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import Home from "@/pages/Home";
import Dashboard from "@/pages/dashboard";
import Courses from "@/pages/Courses";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { ROUTES } from "@/constants/routes";

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Routes>
        <Route element={<Layout />}>
          <Route index path={ROUTES.HOME} element={<Home />} />
          <Route
            path={ROUTES.LOGIN}
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path={ROUTES.REGISTER}
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route path={ROUTES.COURSES} element={<Courses />} />
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
