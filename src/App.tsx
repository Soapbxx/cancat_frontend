import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import TransactionsPage from "./pages/TransactionsPage";
import Header from "./components/Header";
import Subheader from "./components/Subheader";
import AcceptInvitationPage from "./pages/AcceptInvitationPage";
import Connection from "./pages/Connection";
import Invite from "./pages/Invite";
import Profile from "./pages/Profile";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const clientId =
    "980253608759-krprok4is8kto2rc79ft0kggad8lmhq5.apps.googleusercontent.com";

  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
      console.log("User is authenticated");
      console.log("Auth: ", isAuthenticated);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/transactions"
              element={
                <>
                  <Header />
                  <Subheader />
                  <TransactionsPage />
                </>
              }
            />
            <Route
              path="/accept-invitation/:id"
              element={<AcceptInvitationPage />}
            />
            <Route
              path="/invite"
              element={
                <>
                  <Header />
                  <Subheader />
                  <Invite />
                </>
              }
            />
            <Route
              path="/connection"
              element={
                <>
                  <Header />
                  <Subheader />
                  <Connection />
                </>
              }
            />
            <Route path="/" element={<Navigate to="/transactions" replace />} />
            <Route
              path="/profile"
              element={
                <>
                  <Header />
                  <Subheader />
                  <Profile />
                </>
              }
            />
            <Route path="*" element={<Navigate to="/transactions" replace />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
