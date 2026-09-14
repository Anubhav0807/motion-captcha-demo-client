
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginCard from "../components/LoginCard";

function Login() {
  const navigate = useNavigate();

  const [loginMessage, setLoginMessage] = useState("");

  const handleLogin = async (email, password) => {
    try {
      setLoginMessage("");

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setLoginMessage(data.message);
        return;
      }

      // Store JWT token
      localStorage.setItem("token", data.token);

      // Navigate to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);

      setLoginMessage(
        "Cannot connect to the server."
      );
    }
  };

  return (
    <div className="page">

      {/* Navbar */}
      <header className="navbar">

        <div className="brand">

          <div className="brand-logo">
            M
          </div>

          <span>
            MotionClient
          </span>

        </div>

        <div className="tenant-info">
          Client Portal
        </div>

      </header>


      {/* Login */}
      <main className="login-container">

        <div className="login-card-wrapper">

          {/* Heading */}
          <div className="welcome-text">

            <p className="small-label">
              SECURE CLIENT PORTAL
            </p>

            <h1>
              Welcome back
            </h1>

            <p className="subtitle">
              Sign in to access your account.
            </p>

          </div>


          {/* Login Form */}
          <LoginCard
            onLogin={handleLogin}
          />


          {/* Error / Success Message */}
          {loginMessage && (
            <div className="login-message">
              {loginMessage}
            </div>
          )}


          {/* Signup Link */}
          <p
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "#697386",
              marginTop: "20px"
            }}
          >
            Don't have an account?{" "}

            <Link
              to="/signup"
              style={{
                color: "#4f46e5",
                fontWeight: "600",
                textDecoration: "none"
              }}
            >
              Create account
            </Link>
          </p>


          {/* Security Message */}
          <div className="security-note">

            <span className="lock-icon">
              🔒
            </span>

            <span>
              Your connection is protected by
              <strong> MotionCAPTCHA-X</strong>
            </span>

          </div>

        </div>

      </main>


      {/* Footer */}
      <footer>
        © 2026 MotionClient. All rights reserved.
      </footer>

    </div>
  );
}

export default Login;

