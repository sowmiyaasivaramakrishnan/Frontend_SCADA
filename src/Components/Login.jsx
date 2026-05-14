import React, { useState, useEffect } from "react";
import logoImage from "../assets/Venwind_Logo_Final.png";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const Login = () => {

  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  const [rememberMe, setRememberMe] = useState(false);

  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError(null);
    }

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setIsLoading(true);

    setError(null);

    setLoginSuccess(false);

    try {

      // SEND IDENTIFIER + PASSWORD

      const payload = {

        identifier: credentials.identifier,

        password: credentials.password,

      };

      const response = await fetch(
        `${API_BASE_URL}/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok && data) {

        setLoginSuccess(true);

        // STORE TOKEN

        if (data.access_token) {

          localStorage.setItem(
            "token",
            data.access_token
          );

        }

        // STORE USER DATA

        localStorage.setItem(
          "user_name",
          data.name || ""
        );

        localStorage.setItem(
          "username",
          data.username || ""
        );

        localStorage.setItem(
          "role",
          data.role || ""
        );

        // STORE REMEMBER LOGIN

        if (rememberMe) {

          localStorage.setItem(
            "rememberedIdentifier",
            credentials.identifier
          );

        } else {

          localStorage.removeItem(
            "rememberedIdentifier"
          );

        }

        alert(
          `Login Successful!\n\nWelcome back, ${data.name || credentials.identifier}!\n\nRole: ${data.role}\n\nYou will be redirected to the dashboard.`
        );

        setTimeout(() => {

          window.location.href =
            "/dashboard";

        }, 1500);

      } else {

        const errorMessage =
          data.detail ||
          data.message ||
          "Login failed. Please try again.";

        setError(errorMessage);

        alert(
          `Login Failed!\n\n${errorMessage}\n\nPlease check your credentials and try again.`
        );

      }

    } catch (err) {

      console.error(
        "Login error:",
        err
      );

      const errorMsg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred";

      setError(errorMsg);

      alert(
        `Connection Error!\n\n${errorMsg}\n\nPlease check your internet connection and try again.`
      );

    } finally {

      setIsLoading(false);

    }

  };

  useEffect(() => {

    const rememberedIdentifier =
      localStorage.getItem(
        "rememberedIdentifier"
      );

    if (rememberedIdentifier) {

      setCredentials((prev) => ({
        ...prev,
        identifier:
          rememberedIdentifier,
      }));

      setRememberMe(true);

    }

  }, []);

  return (
    <>

      <div className="login-main-container">

        <div className="login-card-container">

          <div className="login-inner-box">

            <div className="logo-section">

              <img
                src={logoImage}
                alt="Venwind Logo"
                className="logo-image"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />

              <h5 className="welcome-title">
                WELCOME
              </h5>

            </div>

            <form onSubmit={handleSubmit}>

              <table className="login-table">

                <tbody>

                  {/* IDENTIFIER */}

                  <tr>

                    <td>

                      <input
                        type="text"
                        name="identifier"
                        value={
                          credentials.identifier
                        }
                        onChange={handleChange}
                        placeholder="Enter Email ID or Username"
                        required
                        autoComplete="off"
                        disabled={isLoading}
                        className="input-field"
                      />

                    </td>

                  </tr>

                  {/* PASSWORD */}

                  <tr>

                    <td>

                      <input
                        type="password"
                        name="password"
                        value={
                          credentials.password
                        }
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        autoComplete="new-password"
                        disabled={isLoading}
                        className="input-field"
                      />

                      <div className="forgot-password">

                        <a href="/forgot-password">
                          Forgot password?
                        </a>

                      </div>

                    </td>

                  </tr>

                  {/* BUTTON */}

                  <tr>

                    <td>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="login-button"
                      >

                        {isLoading ? (
                          <>
                            <span className="loading-spinner"></span>
                            Loading...
                          </>
                        ) : (
                          "Login"
                        )}

                      </button>

                    </td>

                  </tr>

                </tbody>

              </table>

            </form>

            {/* SIGNUP */}

            <div className="signup-section">

              <a
                href="/register"
                className="signup-link"
              >
                Don't Have Account? - SignUp
              </a>

            </div>

          </div>

        </div>

      </div>

      <style>{`

        *{
          box-sizing:border-box;
        }

        body{
          margin:0;
          padding:0;
          overflow-x:hidden;
          font-family:Arial,sans-serif;
        }

        .login-main-container{
          min-height:100vh;
          width:100%;
          display:flex;
          align-items:center;
          justify-content:center;
          background-color:white;
          padding:20px;
        }

        .login-card-container{
          background-color:rgb(198,207,88);
          border-radius:15px;
          padding:25px;
          box-shadow:0 10px 25px rgba(0,0,0,0.1);
          width:100%;
          max-width:450px;
        }

        .login-inner-box{
          background-color:rgb(244,243,226);
          border-radius:12px;
          padding:25px;
          box-shadow:0 2px 10px rgba(225,190,64,0.05);
        }

        .logo-section{
          margin-bottom:25px;
          text-align:center;
        }

        .logo-image{
          width:150px;
          height:55px;
          object-fit:contain;
          display:block;
          margin:0 auto 18px;
        }

        .welcome-title{
          font-size:28px;
          font-weight:700;
          color:#004a92;
          margin:0;
          letter-spacing:1px;
        }

        .login-table{
          width:100%;
          border-collapse:collapse;
        }

        .login-table td{
          padding:10px 0;
        }

        .input-field{
          width:100%;
          padding:12px 15px;
          border:1px solid #e0e0e0;
          border-radius:8px;
          font-size:14px;
          background-color:#f9f9f9;
          transition:all 0.3s ease;
          outline:none;
        }

        .input-field:focus{
          border-color:rgb(198,207,88);
          background-color:white;
          box-shadow:0 0 0 3px rgba(198,207,88,0.1);
        }

        .input-field::placeholder{
          color:#999;
          font-size:14px;
        }

        .forgot-password{
          text-align:right;
          margin-top:8px;
        }

        .forgot-password a{
          color:#004a92;
          text-decoration:none;
          font-size:12px;
        }

        .forgot-password a:hover{
          color:#3e95ec;
          text-decoration:underline;
        }

        .remember-section{
          display:flex;
          align-items:center;
          gap:8px;
          font-size:13px;
          color:#333;
        }

        .login-button{
          width:80%;
          padding:10px 20px;
          background-color:#004a92;
          color:#fff;
          border:none;
          border-radius:50px;
          font-size:16px;
          font-weight:600;
          cursor:pointer;
          transition:all 0.3s ease;
          margin:20px auto 0;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .login-button:hover{
          background-color:#1171d2;
          transform:translateY(-2px);
          box-shadow:0 4px 12px rgba(198,207,88,0.3);
        }

        .login-button:disabled{
          opacity:0.7;
          cursor:not-allowed;
        }

        .loading-spinner{
          width:18px;
          height:18px;
          border:2px solid #ffffff;
          border-top:2px solid rgb(198,207,88);
          border-radius:50%;
          margin-right:8px;
          animation:spin 0.8s linear infinite;
        }

        .signup-section{
          margin-top:25px;
          text-align:center;
          padding-top:20px;
          border-top:1px solid #f0f0f0;
        }

        .signup-link{
          color:#004a92;
          text-decoration:none;
          font-size:14px;
          font-weight:500;
        }

        .signup-link:hover{
          color:#3e95ec;
          text-decoration:underline;
        }

        @keyframes spin{
          0%{
            transform:rotate(0deg);
          }
          100%{
            transform:rotate(360deg);
          }
        }

        @media screen and (max-width:768px){

          .login-card-container{
            padding:20px;
          }

          .login-inner-box{
            padding:20px;
          }

          .login-button{
            width:100%;
          }

        }

        @media screen and (max-width:480px){

          .login-card-container{
            padding:15px;
          }

          .login-inner-box{
            padding:15px;
          }

          .welcome-title{
            font-size:22px;
          }

          .input-field{
            font-size:13px;
          }

        }

      `}</style>

    </>
  );
};

export default Login;