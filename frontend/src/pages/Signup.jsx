import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      // Store JWT
      localStorage.setItem("token", data.token);

      setMessage("Account created successfully!");

      // Go to login after signup
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      console.error(error);

      setMessage(
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


      {/* Signup */}

      <main className="login-container">

        <div className="login-card-wrapper">

          <div className="welcome-text">

            <p className="small-label">
              SECURE CLIENT PORTAL
            </p>

            <h1>
              Create your account
            </h1>

            <p className="subtitle">
              Sign up to access your client portal.
            </p>

          </div>


          <div className="login-card">

            <form onSubmit={handleSignup}>

              {/* Name */}

              <div className="form-group">

                <label htmlFor="name">
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* Email */}

              <div className="form-group">

                <label htmlFor="email">
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* Password */}

              <div className="form-group">

                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />

              </div>


              {/* Signup button */}

              <button
                type="submit"
                className="login-button"
              >
                Create account
              </button>

            </form>


            {/* Message */}

            {message && (
              <div className="login-message">
                {message}
              </div>
            )}


            <div className="divider">
              <span>or</span>
            </div>


            {/* Login */}

            <p
              style={{
                textAlign: "center",
                fontSize: "13px",
                color: "#697386"
              }}
            >
              Already have an account?{" "}

              <Link
                to="/"
                style={{
                  color: "#4f46e5",
                  fontWeight: "600",
                  textDecoration: "none"
                }}
              >
                Sign in
              </Link>

            </p>

          </div>


          <div className="security-note">

            <span className="lock-icon">
              🔒
            </span>

            <span>
              Protected by
              <strong> MotionCAPTCHA-X</strong>
            </span>

          </div>

        </div>

      </main>


      <footer>
        © 2026 MotionClient. All rights reserved.
      </footer>

    </div>
  );
}

export default Signup;