import { useState } from "react";
import CustomInput from "./CustomInput";

function LoginCard({
  onLogin,
  showCaptcha,
  captchaImage,
  captchaAnswer,
  setCaptchaAnswer,
  onCaptchaSubmit,
  isLoading,
  captchaType,
  captchaStatus,
  onCaptchaImageLoad,
  onCaptchaImageError,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    onLogin(email, password);
  };

  const captchaLoadingText =
    captchaType === "static"
      ? "Loading static CAPTCHA..."
      : captchaType === "dynamic"
      ? "Loading dynamic CAPTCHA..."
      : "Loading CAPTCHA...";

  return (
    <div className="login-card">
      <form onSubmit={handleSubmit}>
        {/* =========================
            EMAIL
        ========================= */}
        <div className="form-group">
          <label>Email address</label>

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
            <label>Password</label>

            <button type="button" className="forgot-password">
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
            (idle, or fetching the risk score)
        ========================= */}
        {!showCaptcha && (
          <div className="captcha-placeholder">
            {isLoading ? (
              <>
                <div className="spinner" aria-hidden="true" />

                <div role="status" aria-live="polite">
                  <p className="captcha-title">Analyzing behavior</p>

                  <p className="captcha-description">
                    Checking your risk score...
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="captcha-placeholder-icon">🛡️</div>

                <div>
                  <p className="captcha-title">MotionCAPTCHA</p>

                  <p className="captcha-description">
                    Human verification will appear here
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* =========================
            CAPTCHA
        ========================= */}
        {showCaptcha && (
          <div className="captcha-container">
            {/* CAPTCHA HEADER */}
            <div className="captcha-header">
              <div>
                <p className="captcha-title">MotionCAPTCHA</p>

                <p className="captcha-description">
                  Complete the verification below
                </p>
              </div>
            </div>

            {/* LOADING STATE: shown until the image has loaded */}
            {captchaStatus === "loading" && (
              <div
                className="captcha-loading"
                role="status"
                aria-live="polite"
              >
                <div className="spinner" aria-hidden="true" />
                <span>{captchaLoadingText}</span>
              </div>
            )}

            {/* ERROR STATE */}
            {captchaStatus === "error" && (
              <div className="captcha-loading captcha-error" role="alert">
                Could not load the CAPTCHA.
              </div>
            )}

            {/* =========================
                CAPTCHA IMAGE
                (kept in the DOM so it can load, hidden until ready)
            ========================= */}
            {captchaImage && (
              <img
                src={captchaImage}
                alt="CAPTCHA verification"
                className="captcha-image"
                style={{
                  display: captchaStatus === "ready" ? "block" : "none",
                }}
                onLoad={onCaptchaImageLoad}
                onError={onCaptchaImageError}
              />
            )}

            {/* =========================
                CAPTCHA INPUT
            ========================= */}
            {captchaStatus === "ready" && (
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
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
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
            )}
          </div>
        )}

        {/* =========================
            SIGN IN BUTTON
        ========================= */}
        {!showCaptcha && (
          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="button-loading">
                <span className="spinner spinner-small" aria-hidden="true" />
                Checking...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        )}
      </form>
    </div>
  );
}

export default LoginCard;