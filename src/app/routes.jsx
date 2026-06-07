import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ConfirmOTP from "../features/auth/pages/ConfirmOTP";
import Dashboard from "../pages/Dashboard";
import WorkspacePage from "../pages/WorkspacePage";
import ProtectedRoute from "../components/ProtectedRoute";
import CreateProfile from "../pages/CreateProfile";
import { Toaster } from "react-hot-toast";
import WorkspaceJoinPage from "../pages/WorkspaceJoinPage";
import PublicRoute from "../components/PublicRoute";
import BoardPage from "../pages/BoardPage";
import Profile from "../pages/Profile";

export default function AppRoutes() {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/confirm"
            element={
              <PublicRoute>
                <ConfirmOTP />
              </PublicRoute>
            }
          />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route
            path="/workspace/join/:workspaceId"
            element={<WorkspaceJoinPage />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workspace/:workspaceId"
            element={
              <ProtectedRoute>
                <WorkspacePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workspace/:workspaceId/board/:boardId"
            element={
              <ProtectedRoute>
                <BoardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
