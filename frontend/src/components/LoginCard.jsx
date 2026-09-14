import { useState } from "react";
import CustomInput from "./CustomInput";

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

        {/* EMAIL */}
        <div className="form-group">

          <label>
            Email address
          </label>

          <CustomInput
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            type="email"
            ariaLabel="Email address"
          />

        </div>


        {/* PASSWORD */}
        <div className="form-group">

          <div className="password-label">

            <label>
              Password
            </label>

            <button
              type="button"
              className="forgot-password"
            >
              Forgot password?
            </button>

          </div>

          <CustomInput
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
            type="password"
            ariaLabel="Password"
          />

        </div>


        {/* MOTION CAPTCHA */}

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


        {/* LOGIN BUTTON */}

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