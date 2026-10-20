import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMotionCaptcha } from "motion-captcha-react-sdk";

import LoginCard from "../components/LoginCard";

const BACKEND_API = import.meta.env.VITE_BACKEND_API;
const CAPTCHA_API = import.meta.env.VITE_CAPTCHA_API;

// Needed for ngrok free domains, otherwise ngrok returns its own
// warning page (no CORS headers) instead of your API response.
const NGROK_HEADERS = {
  "ngrok-skip-browser-warning": "true",
};

function Login() {
  const navigate = useNavigate();

  const { getTrackingSummary, stopTracking } = useMotionCaptcha();

  const [flowState, setFlowState] = useState("init");

  const [loginMessage, setLoginMessage] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  // "static" | "dynamic" | ""
  const [captchaType, setCaptchaType] = useState("");

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    captchaToken: "",
  });

  // Release the previous Blob URL when the image changes or
  // the component unmounts.
  useEffect(() => {
    return () => {
      if (captchaImage.startsWith("blob:")) {
        URL.revokeObjectURL(captchaImage);
      }
    };
  }, [captchaImage]);

  // LOGIN AND RISK ASSESSMENT
  const handleLogin = async (email, password) => {
    setLoginMessage("");
    setFlowState("analyzing");

    setCredentials((prev) => ({
      ...prev,
      email: email,
      password: password
    }));
    setCaptchaAnswer("");
    setCaptchaType("");
    setCaptchaImage(""); // the effect above revokes the old Blob URL

    try {
      // Collect behavioral data.
      const behaviorData = getTrackingSummary();

      console.log("Behavior data:", behaviorData);

      // Send behavior data to the risk API.
      const metricsResponse = await fetch(CAPTCHA_API + "/metrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...NGROK_HEADERS,
        },
        body: JSON.stringify(behaviorData),
      });

      if (!metricsResponse.ok) {
        throw new Error(
          `Metrics API returned ${metricsResponse.status}`
        );
      }

      // Read the backend response.
      const metricsData = await metricsResponse.json();

      console.log("Metrics response:", metricsData);

      const riskScore = Number(metricsData.risk_score);
      const captchaToken = metricsData.token;

      setCredentials((prev) => ({
        ...prev,
        captchaToken: captchaToken,
      }));

      if (
        metricsData.risk_score === undefined ||
        !Number.isFinite(riskScore) ||
        riskScore < 0 ||
        riskScore > 100
      ) {
        throw new Error("Invalid risk score received from backend.");
      }

      console.log("Backend risk score:", riskScore);

      // Risk score received: show the CAPTCHA panel in a loading state.
      setFlowState("generating");
      setLoginMessage("");

      if (riskScore < 50) {
        // STATIC CAPTCHA (PNG from the CAPTCHA API)
        setCaptchaType("static");
        console.log("Loading static CAPTCHA GIF...");
      } else {
        // DYNAMIC CAPTCHA (GIF from the CAPTCHA API)
        setCaptchaType("dynamic");
        console.log("Loading dynamic CAPTCHA GIF...");
      }

      const captchaResponse = await fetch(
        `${CAPTCHA_API}/captcha` +
        `?token=${captchaToken}` +
        `&uppercase=${true}` +
        `&lowercase=${false}` +
        `&numbers=${true}`,
        {
          method: "GET",
          cache: "no-store",
          headers: NGROK_HEADERS,
        }
      );

      if (!captchaResponse.ok) {
        throw new Error(
          `CAPTCHA API returned ${captchaResponse.status}`
        );
      }

      const gifBlob = await captchaResponse.blob();

      console.log("CAPTCHA content type:", gifBlob.type);
      console.log("CAPTCHA file size:", gifBlob.size);

      if (gifBlob.size === 0) {
        throw new Error("The CAPTCHA API returned an empty file.");
      }

      if (
        gifBlob.type &&
        !gifBlob.type.startsWith("image/") &&
        gifBlob.type !== "application/octet-stream"
      ) {
        throw new Error(
          `Expected an image but received ${gifBlob.type}`
        );
      }

      // Create a browser URL for displaying the downloaded GIF.
      // The <img> onLoad handler switches status to "ready".
      setCaptchaImage(URL.createObjectURL(gifBlob));
      
      setFlowState("captcha-ready");
    } catch (error) {
      console.error("Risk assessment/CAPTCHA error:", error);

      setCaptchaType("");
      setFlowState("captcha-not-found");

      setLoginMessage(
        error.message ||
        "Unable to complete security verification."
      );
    } finally {
      try {
        stopTracking();
      } catch (error) {
        console.error("Tracking cleanup error:", error);
      }
    }
  };

  // Called by the CAPTCHA <img> in LoginCard
  const handleCaptchaImageLoad = () => {
    setLoginMessage("Complete the CAPTCHA to continue.");
  };

  const handleCaptchaImageError = () => {
    setLoginMessage("Failed to load the CAPTCHA image. Please try again.");
  };

  // CAPTCHA VERIFICATION AND LOGIN
  const handleCaptchaSubmit = async () => {
    setLoginMessage("");

    if (!captchaAnswer.trim()) {
      setLoginMessage("Please enter the CAPTCHA.");
      return;
    }

    const payload = {
      ...credentials,
      captchaText: captchaAnswer,
    }

    try {
      const response = await fetch(BACKEND_API + "/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      if (!data.token) {
        throw new Error("Authentication token was not returned.");
      }

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      setLoginMessage(
        error.message || "Cannot connect to the server."
      );
    }
  };

  return (
    <div className="page">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="brand">
          <div className="brand-logo">M</div>
          <span>MotionClient</span>
        </div>

        <div className="tenant-info">Client Portal</div>
      </header>

      {/* LOGIN */}
      <main className="login-container">
        <div className="login-card-wrapper">
          <div className="welcome-text">
            <p className="small-label">SECURE CLIENT PORTAL</p>

            <h1>Welcome back</h1>

            <p className="subtitle">
              Sign in to access your account.
            </p>
          </div>

          <LoginCard
            onLogin={handleLogin}
            captchaImage={captchaImage}
            captchaAnswer={captchaAnswer}
            setCaptchaAnswer={setCaptchaAnswer}
            onCaptchaSubmit={handleCaptchaSubmit}
            flowState={flowState}
            captchaType={captchaType}
            onCaptchaImageLoad={handleCaptchaImageLoad}
            onCaptchaImageError={handleCaptchaImageError}
          />

          {loginMessage && (
            <div className="login-message" role="status">
              {loginMessage}
            </div>
          )}

          <p
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "#697386",
              marginTop: "20px",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{
                color: "#4f46e5",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Create account
            </Link>
          </p>

          <div className="security-note">
            <span className="lock-icon">🔒</span>
            <span>
              Your connection is protected by
              <strong> MotionCAPTCHA</strong>
            </span>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer>
        © { new Date().getFullYear() } MotionClient. All rights reserved.
      </footer>
    </div>
  );
}

export default Login;