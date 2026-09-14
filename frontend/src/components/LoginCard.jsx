import { useState } from "react";

function LoginCard({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="login-card">

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="email">
            Email address
          </label>

          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <div className="password-label">
            <label htmlFor="password">
              Password
            </label>

            <button
              type="button"
              className="forgot-password"
            >
              Forgot password?
            </button>
          </div>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {/* MotionCAPTCHA will be inserted here later */}

        <div className="captcha-placeholder">

          <div className="captcha-placeholder-icon">
            🛡️
          </div>

          <div>
            <p className="captcha-title">
              MotionCAPTCHA
            </p>

            <p className="captcha-description">
              Human verification will appear here
            </p>
          </div>

        </div>

        <button
          type="submit"
          className="login-button"
        >
          Sign in
        </button>

      </form>

    </div>
  );
}

export default LoginCard;