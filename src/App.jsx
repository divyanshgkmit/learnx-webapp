import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/Sonner";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import Home from "@/pages/Home";
import Dashboard from "@/pages/dashboard";
import CourseEditor from "@/pages/dashboard/CourseEditor";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import WatchCourse from "@/pages/learning/WatchCourse";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Profile from "@/pages/Profile";
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
          <Route path={ROUTES.COURSE_DETAIL} element={<CourseDetail />} />
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.COURSE_EDITOR}
            element={
              <ProtectedRoute>
                <CourseEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.LEARN}
            element={
              <ProtectedRoute>
                <WatchCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;