import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/Venwind_Logo_Final.png";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setIdentifier(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identifier.trim()) {
      alert("Please enter Email Address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: identifier,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(
          data.message ||
            "OTP sent successfully to your Email!"
        );

        localStorage.setItem(
          "reset_email",
          identifier
        );

        setTimeout(() => {
          navigate("/verify-password");
        }, 1500);
      } else if (response.status === 404) {
        alert(
          data.detail ||
            "No account found with this Email"
        );
      } else if (response.status === 500) {
        alert(
          data.detail ||
            "Failed to send OTP. Please try again later."
        );
      } else {
        alert(
          data.detail ||
            "Something went wrong. Please try again."
        );
      }
    } catch (err) {
      console.error("Forgot password error:", err);

      alert(
        "Network error. Please check your connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="forgot-main-container">
        <div className="forgot-card-container">
          <div className="forgot-inner-box">
            <div className="forgot-logo-section">
              <img
                src={logoImage}
                alt="Venwind Logo"
                className="forgot-logo-image"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />

              <h5 className="forgot-title">
                Forgot Password
              </h5>

              <p className="forgot-subtitle">
                Enter your Email to reset password
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <table className="forgot-table">
                <tbody>
                  <tr>
                    <td>
                      <input
                        type="email"
                        value={identifier}
                        onChange={handleChange}
                        placeholder="Email Address"
                        required
                        disabled={isLoading}
                        className="forgot-input-field"
                        autoComplete="off"
                      />
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="forgot-button"
                      >
                        {isLoading ? (
                          <>
                            <span className="forgot-loading-spinner"></span>
                            Sending OTP...
                          </>
                        ) : (
                          "Send OTP"
                        )}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>

            <div className="forgot-login-section">
              <a
                href="/login"
                className="forgot-login-link"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                Back to Login
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
          font-family:Arial, sans-serif;
        }

        .forgot-main-container{
          min-height:100vh;
          width:100%;
          display:flex;
          align-items:center;
          justify-content:center;
          background-color:white;
          padding:20px;
        }

        .forgot-card-container{
          background-color:rgb(198, 207, 88);
          border-radius:15px;
          padding:25px;
          box-shadow:0 10px 25px rgba(0,0,0,0.1);
          width:100%;
          max-width:450px;
        }

        .forgot-inner-box{
          background-color:rgb(244, 243, 226);
          border-radius:12px;
          padding:25px;
          box-shadow:0 2px 10px rgba(225,190,64,0.05);
        }

        .forgot-logo-section{
          margin-bottom:25px;
          text-align:center;
        }

        .forgot-logo-image{
          width:150px;
          height:55px;
          object-fit:contain;
          display:block;
          margin:0 auto 18px;
        }

        .forgot-title{
          font-size:28px;
          font-weight:700;
          color:#004a92;
          margin:0 0 10px;
          letter-spacing:1px;
        }

        .forgot-subtitle{
          font-size:14px;
          color:#666;
          margin:0;
          line-height:1.5;
        }

        .forgot-table{
          width:100%;
          border-collapse:collapse;
        }

        .forgot-table td{
          padding:10px 0;
        }

        .forgot-input-field{
          width:100%;
          padding:12px 15px;
          border:1px solid #e0e0e0;
          border-radius:8px;
          font-size:14px;
          background-color:#f9f9f9;
          transition:all 0.3s ease;
          outline:none;
        }

        .forgot-input-field:focus{
          border-color:rgb(198, 207, 88);
          background-color:white;
          box-shadow:0 0 0 3px rgba(198,207,88,0.1);
        }

        .forgot-input-field::placeholder{
          color:#999;
          font-size:14px;
        }

        .forgot-button{
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
          gap:10px;
        }

        .forgot-button:hover{
          background-color:#1171d2;
          transform:translateY(-2px);
          box-shadow:0 4px 12px rgba(198,207,88,0.3);
        }

        .forgot-button:disabled{
          opacity:0.7;
          cursor:not-allowed;
        }

        .forgot-loading-spinner{
          width:18px;
          height:18px;
          border:2px solid #ffffff;
          border-top:2px solid rgb(198,207,88);
          border-radius:50%;
          animation:spin 0.8s linear infinite;
        }

        .forgot-login-section{
          margin-top:25px;
          text-align:center;
          padding-top:20px;
          border-top:1px solid #f0f0f0;
        }

        .forgot-login-link{
          color:#004a92;
          text-decoration:none;
          font-size:14px;
          font-weight:500;
        }

        .forgot-login-link:hover{
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

        @media screen and (min-width:1920px){

          .forgot-card-container{
            max-width:540px;
          }

          .forgot-inner-box{
            padding:35px;
          }

          .forgot-title{
            font-size:34px;
          }

          .forgot-input-field{
            font-size:16px;
            padding:15px 18px;
          }

          .forgot-button{
            font-size:18px;
            padding:14px 20px;
          }
        }

        @media screen and (max-width:1440px){

          .forgot-card-container{
            max-width:450px;
          }
        }

        @media screen and (max-width:768px){

          .forgot-main-container{
            padding:15px;
          }

          .forgot-card-container{
            width:100%;
            max-width:100%;
            padding:20px;
          }

          .forgot-inner-box{
            padding:20px;
          }

          .forgot-logo-image{
            width:120px;
            height:50px;
          }

          .forgot-title{
            font-size:24px;
          }

          .forgot-input-field{
            padding:11px 14px;
            font-size:13px;
          }

          .forgot-button{
            width:100%;
            font-size:15px;
          }
        }


        @media screen and (max-width:480px){

          .forgot-main-container{
            padding:12px;
          }

          .forgot-card-container{
            padding:15px;
            border-radius:12px;
          }

          .forgot-inner-box{
            padding:15px;
          }

          .forgot-logo-image{
            width:100px;
            height:45px;
            margin-bottom:15px;
          }

          .forgot-title{
            font-size:20px;
          }

          .forgot-subtitle{
            font-size:12px;
          }

          .forgot-input-field{
            padding:10px 12px;
            font-size:12px;
          }

          .forgot-button{
            width:100%;
            padding:10px;
            font-size:14px;
          }

          .forgot-login-link{
            font-size:13px;
          }
        }

        @media screen and (max-height:700px){

          .forgot-main-container{
            padding:10px;
          }

          .forgot-card-container{
            padding:15px;
          }

          .forgot-inner-box{
            padding:15px;
          }

          .forgot-logo-section{
            margin-bottom:18px;
          }

          .forgot-title{
            font-size:20px;
          }
        }

      `}</style>
    </>
  );
};

export default ForgotPassword;