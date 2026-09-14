import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionCaptchaProvider } from "motion-captcha-react-sdk";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MotionCaptchaProvider>
      <App />
    </MotionCaptchaProvider>
  </StrictMode>,
);
