import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMotionCaptcha } from "motion-captcha-react-sdk";

import LoginCard from "../components/LoginCard";

function Login() {
  const navigate = useNavigate();

  const [loginMessage, setLoginMessage] = useState("");

  // MotionCAPTCHA SDK
  const {
    getTrackingSummary,
    stopTracking,
  } = useMotionCaptcha();


  const handleLogin = async (email, password) => {
    try {
      setLoginMessage("");


      // ==========================================
      // 1. GET BEHAVIOR DATA
      // ==========================================

      const behaviorData = getTrackingSummary();


      // ==========================================
      // 2. STOP TRACKING
      // ==========================================

      stopTracking();


      // ==========================================
      // 3. SEND BEHAVIOR DATA TO METRICS API
      // ==========================================

      const metricsResponse = await fetch(
        "https://energy-footwear-bok.ngrok-free.dev/api/metrics",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(behaviorData)
        }
      );


      if (!metricsResponse.ok) {
        console.error(
          "Failed to send behavior data:",
          metricsResponse.status
        );
      }


      // ==========================================
      // 4. LOGIN API REQUEST
      // ==========================================

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


      // ==========================================
      // 5. HANDLE LOGIN ERROR
      // ==========================================

      if (!response.ok) {
        setLoginMessage(
          data.message || "Login failed"
        );

        return;
      }


      // ==========================================
      // 6. STORE JWT
      // ==========================================

      localStorage.setItem(
        "token",
        data.token
      );


      // ==========================================
      // 7. LOGIN SUCCESS
      // ==========================================

      navigate("/dashboard");


    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      setLoginMessage(
        "Cannot connect to the server."
      );
    }
  };


  return (
    <div className="page">


      {/* =========================
          NAVBAR
      ========================= */}

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


      {/* =========================
          LOGIN SECTION
      ========================= */}

      <main className="login-container">

        <div className="login-card-wrapper">


          {/* =========================
              HEADING
          ========================= */}

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


          {/* =========================
              LOGIN FORM
          ========================= */}

          <LoginCard
            onLogin={handleLogin}
          />


          {/* =========================
              LOGIN ERROR
          ========================= */}

          {loginMessage && (
            <div className="login-message">
              {loginMessage}
            </div>
          )}


          {/* =========================
              SIGNUP LINK
          ========================= */}

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


          {/* =========================
              SECURITY MESSAGE
          ========================= */}

          <div className="security-note">

            <span className="lock-icon">
              🔒
            </span>

            <span>
              Your connection is protected by
              <strong>
                {" "}MotionCAPTCHA-X
              </strong>
            </span>

          </div>

        </div>

      </main>


      {/* =========================
          FOOTER
      ========================= */}

      <footer>
        © 2026 MotionClient. All rights reserved.
      </footer>

    </div>
  );
}

export default Login;