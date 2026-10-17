import { useState } from "react";
import CustomInput from "./CustomInput";

function LoginCard({
  onLogin,
  captchaImage,
  captchaAnswer,
  setCaptchaAnswer,
  onCaptchaSubmit,
  flowState,
  captchaType,
  onCaptchaImageLoad,
  onCaptchaImageError,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (flowState === "analyzing") return;
    onLogin(email, password);
  };

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

            <button type="button" className="forgot-password" tabIndex={-1}>
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

        {["init", "analyzing", "generating"].includes(flowState) && (
          <div className="captcha-placeholder">
            {flowState === "init" ? (
              <>
                <div className="captcha-placeholder-icon">🛡️</div>

                <div>
                  <p className="captcha-title">MotionCAPTCHA</p>

                  <p className="captcha-description">
                    Human verification will appear here
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="spinner" aria-hidden="true" />

                {flowState === "generating" ? (
                  <div>
                    {captchaType === "static" ? (
                      <p className="captcha-title">Low threat level</p>
                    ) : (
                      <p className="captcha-title">High threat level detected!</p>
                    )}

                    <p className="captcha-description">
                      Generating {captchaType} captcha...
                    </p>
                  </div>
                ) : (
                  <div role="status" aria-live="polite">
                    <p className="captcha-title">Analyzing behavior</p>

                    <p className="captcha-description">
                      Checking your risk score...
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {flowState === "captcha-ready" && (
          <div className="captcha-container">

            {/* =========================
                CAPTCHA IMAGE
                (kept in the DOM so it can load, hidden until ready)
            ========================= */}
            {captchaImage && (
              <img
                src={captchaImage}
                alt="CAPTCHA verification"
                className="captcha-image"
                onLoad={onCaptchaImageLoad}
                onError={onCaptchaImageError}
              />
            )}

            {/* CAPTCHA INPUT */}
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

              <button
                type="button"
                className="login-button captcha-verify-button"
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
        {["init", "analyzing", "generating"].includes(flowState) && (
          <button
            type="submit"
            className="login-button"
            disabled={["analyzing", "generating"].includes(flowState)}
          >
            {["analyzing", "generating"].includes(flowState) ? "Checking..." : "Sign in"}
          </button>
        )}
      </form>
    </div>
  );
}

export default LoginCard;