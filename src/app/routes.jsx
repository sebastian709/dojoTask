import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ConfirmOTP from "../features/auth/pages/ConfirmOTP";
import Dashboard from "../pages/Dashboard";
import WorkspacePage from "../pages/WorkspacePage";
import ProtectedRoute from "../components/ProtectedRoute";
import CreateProfile from "../pages/CreateProfile";
import InvitePage from "../pages/InvitePage";
import { Toaster } from "react-hot-toast";

export default function AppRoutes() {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/confirm" element={<ConfirmOTP />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/invite/:token" element={<InvitePage />} />

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

        </Routes>
      </BrowserRouter>
    </>
  );
}
