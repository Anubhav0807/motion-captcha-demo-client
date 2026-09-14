import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const getUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        const data = await response.json();

        setUser(data.user);

      } catch (error) {
        console.error(error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    getUser();

  }, [navigate]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };


  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading...
      </div>
    );
  }


  return (
    <div className="dashboard-page">

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


        <div className="dashboard-nav">

          <span>
            {user?.name}
          </span>

          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>

        </div>

      </header>


      {/* Dashboard */}

      <main className="dashboard-container">

        <div className="dashboard-header">

          <div>

            <p className="small-label">
              CLIENT DASHBOARD
            </p>

            <h1>
              Welcome, {user?.name} 👋
            </h1>

            <p className="dashboard-subtitle">
              You have successfully logged in to the
              MotionClient portal.
            </p>

          </div>

        </div>


        {/* Cards */}

        <div className="dashboard-grid">

          {/* Account */}

          <div className="dashboard-card">

            <div className="card-icon">
              👤
            </div>

            <h3>
              Account
            </h3>

            <p>
              {user?.email}
            </p>

            <span className="status-badge">
              Active
            </span>

          </div>


          {/* Security */}

          <div className="dashboard-card">

            <div className="card-icon">
              🛡️
            </div>

            <h3>
              Security
            </h3>

            <p>
              Your account is protected by
              MotionCAPTCHA-X.
            </p>

            <span className="status-badge">
              Protected
            </span>

          </div>


          {/* Verification */}

          <div className="dashboard-card">

            <div className="card-icon">
              ✓
            </div>

            <h3>
              Verification
            </h3>

            <p>
              Human verification status
            </p>

            <span className="status-badge">
              Verified
            </span>

          </div>

        </div>


        {/* MotionCAPTCHA section */}

        <div className="motion-section">

          <div>

            <p className="small-label">
              MOTIONCAPTCHA-X
            </p>

            <h2>
              Adaptive Human Verification
            </h2>

            <p>
              This area will later display the
              MotionCAPTCHA challenge based on
              the user's risk score.
            </p>

          </div>


          <div className="motion-status">

            <div className="motion-circle">
              M
            </div>

            <div>

              <strong>
                Protection Active
              </strong>

              <span>
                Behavioral monitoring ready
              </span>

            </div>

          </div>

        </div>

      </main>


      <footer>
        © 2026 MotionClient. All rights reserved.
      </footer>

    </div>
  );
}

export default Dashboard;