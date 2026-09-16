import { useState } from "react";
import CustomInput from "./CustomInput";

function LoginCard({
  onLogin,
  showCaptcha,
  captchaImage,
  captchaAnswer,
  setCaptchaAnswer,
  onCaptchaSubmit
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="login-card">

      <form onSubmit={handleSubmit}>

        {/* =========================
            EMAIL
        ========================= */}

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


        {/* =========================
            PASSWORD
        ========================= */}

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


        {/* =========================
            BEFORE CAPTCHA
        ========================= */}

        {!showCaptcha && (

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

        )}


        {/* =========================
            CAPTCHA
        ========================= */}

        {showCaptcha && captchaImage && (

          <div className="captcha-container">

            {/* CAPTCHA HEADER */}

            <div className="captcha-header">

              <div>

                <p className="captcha-title">
                  MotionCAPTCHA
                </p>

                <p className="captcha-description">
                  Complete the verification below
                </p>

              </div>

            </div>


            {/* =========================
                CAPTCHA IMAGE
            ========================= */}

            <img
              src={captchaImage}
              alt="CAPTCHA verification"
              className="captcha-image"
            />


            {/* =========================
                CAPTCHA INPUT
            ========================= */}

            <div className="captcha-answer-section">

              <label
                htmlFor="captcha-answer"
                className="captcha-answer-label"
              >
                Enter the text shown in the image
              </label>

              <input
                id="captcha-answer"
                type="text"
                value={captchaAnswer}
                onChange={(e) =>
                  setCaptchaAnswer(e.target.value)
                }
                placeholder="Enter CAPTCHA"
                className="captcha-answer-input"
                autoComplete="off"
              />


              {/* =========================
                  VERIFY BUTTON
              ========================= */}

              <button
                type="button"
                className="captcha-verify-button"
                onClick={onCaptchaSubmit}
              >
                Verify CAPTCHA
              </button>

            </div>

          </div>

        )}


        {/* =========================
            SIGN IN BUTTON
        ========================= */}

        {!showCaptcha && (

          <button
            type="submit"
            className="login-button"
          >
            Sign in
          </button>

        )}

      </form>

    </div>
  );
}

export default LoginCard;