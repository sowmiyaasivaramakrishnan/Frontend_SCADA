import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/Venwind_Logo_Final.png";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const VerifyOTP = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const email = localStorage.getItem("reset_email");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      alert("Please enter OTP");
      return;
    }

    if (otp.length < 4) {
      alert("Please enter valid OTP");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            otp: otp,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert(
          data.message ||
            "OTP verified successfully"
        );

        setTimeout(() => {
          navigate("/set-password");
        }, 1500);

      } else {

        alert(
          data.detail || "Invalid OTP"
        );

      }

    } catch (err) {

      console.error(err);

      alert(
        "Network error. Please check your connection."
      );

    } finally {

      setIsLoading(false);

    }
  };

  return (
    <>
      <div className="verify-main-container">

        <div className="verify-card-container">

          <div className="verify-inner-box">

            <div className="verify-logo-section">

              <img
                src={logoImage}
                alt="Venwind Logo"
                className="verify-logo-image"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />

              <h5 className="verify-title">
                VERIFY OTP
              </h5>

              <p className="verify-subtitle">
                Enter the OTP sent to your Email
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              autoComplete="off"
            >

              <table className="verify-table">

                <tbody>

                  <tr>
                    <td>

                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value)
                        }
                        className="verify-input-field"
                        maxLength="6"
                        required
                        autoComplete="off"
                      />

                    </td>
                  </tr>

                  <tr>
                    <td>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="verify-button"
                      >

                        {isLoading ? (
                          <>
                            <span className="verify-loading-spinner"></span>
                            Verifying...
                          </>
                        ) : (
                          "Verify OTP"
                        )}

                      </button>

                    </td>
                  </tr>

                </tbody>

              </table>

            </form>

            <div className="verify-login-section">

              <a
                href="/login"
                className="verify-login-link"
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
        font-family:Arial,sans-serif;
      }

      .verify-main-container{
        min-height:100vh;
        width:100%;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
        background-color:white;
      }

      .verify-card-container{
        width:100%;
        max-width:450px;
        background-color:rgb(198,207,88);
        border-radius:15px;
        padding:25px;
        box-shadow:0 10px 25px rgba(0,0,0,0.1);
      }

      .verify-inner-box{
        background-color:rgb(244,243,226);
        border-radius:12px;
        padding:25px;
      }

      .verify-logo-section{
        text-align:center;
        margin-bottom:25px;
      }

      .verify-logo-image{
        width:150px;
        height:55px;
        object-fit:contain;
        display:block;
        margin:0 auto 18px;
      }

      .verify-title{
        font-size:28px;
        font-weight:700;
        color:#004a92;
        margin:0 0 10px;
        letter-spacing:1px;
      }

      .verify-subtitle{
        font-size:14px;
        color:#666;
        margin:0;
      }

      .verify-table{
        width:100%;
        border-collapse:collapse;
      }

      .verify-table td{
        padding:10px 0;
      }

      .verify-input-field{
        width:100%;
        padding:12px 15px;
        border:1px solid #e0e0e0;
        border-radius:8px;
        font-size:14px;
        background-color:#f9f9f9;
        transition:all 0.3s ease;
        outline:none;
      }

      .verify-input-field:focus{
        border-color:rgb(198,207,88);
        background-color:white;
        box-shadow:0 0 0 3px rgba(198,207,88,0.1);
      }

      .verify-input-field::placeholder{
        color:#999;
        font-size:14px;
      }

      .verify-button{
        width:80%;
        padding:10px 20px;
        background-color:#004a92;
        color:white;
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

      .verify-button:hover{
        background-color:#1171d2;
        transform:translateY(-2px);
        box-shadow:0 4px 12px rgba(198,207,88,0.3);
      }

      .verify-button:disabled{
        opacity:0.7;
        cursor:not-allowed;
      }

      .verify-loading-spinner{
        width:18px;
        height:18px;
        border:2px solid #ffffff;
        border-top:2px solid rgb(198,207,88);
        border-radius:50%;
        margin-right:8px;
        animation:spin 0.8s linear infinite;
      }

      .verify-login-section{
        margin-top:25px;
        text-align:center;
        padding-top:20px;
        border-top:1px solid #f0f0f0;
      }

      .verify-login-link{
        color:#004a92;
        text-decoration:none;
        font-size:14px;
        font-weight:500;
      }

      .verify-login-link:hover{
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

        .verify-card-container{
          max-width:540px;
        }

        .verify-inner-box{
          padding:35px;
        }

        .verify-title{
          font-size:34px;
        }

        .verify-input-field{
          font-size:16px;
          padding:15px 18px;
        }

        .verify-button{
          font-size:18px;
          padding:14px 20px;
        }

      }

      @media screen and (max-width:768px){

        .verify-main-container{
          padding:15px;
        }

        .verify-card-container{
          max-width:100%;
          padding:20px;
        }

        .verify-inner-box{
          padding:20px;
        }

        .verify-logo-image{
          width:120px;
          height:50px;
        }

        .verify-title{
          font-size:24px;
        }

        .verify-input-field{
          padding:11px 14px;
          font-size:13px;
        }

        .verify-button{
          width:100%;
          font-size:15px;
        }

      }

      @media screen and (max-width:480px){

        .verify-main-container{
          padding:12px;
        }

        .verify-card-container{
          padding:15px;
          border-radius:12px;
        }

        .verify-inner-box{
          padding:15px;
        }

        .verify-logo-image{
          width:100px;
          height:45px;
          margin-bottom:15px;
        }

        .verify-title{
          font-size:20px;
        }

        .verify-subtitle{
          font-size:12px;
        }

        .verify-input-field{
          padding:10px 12px;
          font-size:12px;
        }

        .verify-button{
          width:100%;
          padding:10px;
          font-size:14px;
        }

        .verify-login-link{
          font-size:13px;
        }

      }

      @media screen and (max-height:700px){

        .verify-main-container{
          padding:10px;
        }

        .verify-card-container{
          padding:15px;
        }

        .verify-inner-box{
          padding:15px;
        }

        .verify-logo-section{
          margin-bottom:18px;
        }

        .verify-title{
          font-size:20px;
        }

      }

      `}</style>
    </>
  );
};

export default VerifyOTP;