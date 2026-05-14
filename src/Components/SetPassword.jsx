import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/Venwind_Logo_Final.png";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const SetPassword = () => {

  const navigate = useNavigate();

  const [passwordData, setPasswordData] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password) => {

    if (password.length < 8) {
      return "Password must contain minimum 8 characters";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain Capital letter";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must contain lowercase letter";
    }

    if (!/[0-9]/.test(password)) {
      return "Password must contain number";
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain special character";
    }

    return null;
  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!passwordData.email) {
      alert("Please enter email");
      return;
    }

    const passwordError = validatePassword(
      passwordData.password
    );

    if (passwordError) {
      alert(passwordError);
      return;
    }

    if (
      passwordData.password !==
      passwordData.confirm_password
    ) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {

      const response = await fetch(
        `${API_BASE_URL}/reset-password`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: passwordData.email,
            new_password: passwordData.password,
            confirm_password:
              passwordData.confirm_password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert(
          data.message ||
            "Password Reset Successful!"
        );

        setTimeout(() => {
          navigate("/login");
        }, 1500);

      } else {

        alert(
          data.detail ||
            "Failed to reset password"
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
      <div className="set-main-container">

        <div className="set-card-container">

          <div className="set-inner-box">

            <div className="set-logo-section">

              <img
                src={logoImage}
                alt="Logo"
                className="set-logo-image"
              />

              <h5 className="set-title">
                SET PASSWORD
              </h5>

            </div>

            <form
              onSubmit={handleSubmit}
              autoComplete="off"
            >

              <table className="set-table">
                <tbody>

                  <tr>
                    <td>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={passwordData.email}
                        onChange={handleChange}
                        className="set-input-field"
                        required
                      />
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <input
                        type="password"
                        name="password"
                        placeholder="Set New Password"
                        value={passwordData.password}
                        onChange={handleChange}
                        className="set-input-field"
                        autoComplete="new-password"
                        required
                      />
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <input
                        type="password"
                        name="confirm_password"
                        placeholder="Confirm Password"
                        value={
                          passwordData.confirm_password
                        }
                        onChange={handleChange}
                        className="set-input-field"
                        autoComplete="new-password"
                        required
                      />
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="set-button"
                      >
                        {isLoading ? (
                          <>
                            <span className="set-loading-spinner"></span>
                            Updating...
                          </>
                        ) : (
                          "Update Password"
                        )}
                      </button>
                    </td>
                  </tr>

                </tbody>
              </table>

            </form>

            <div className="set-login-section">

              <a
                href="/login"
                className="set-login-link"
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

      .set-main-container{
        min-height:100vh;
        width:100%;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
        background:white;
      }

      .set-card-container{
        width:100%;
        max-width:470px;
        background:rgb(198,207,88);
        border-radius:15px;
        padding:25px;
      }

      .set-inner-box{
        background:rgb(244,243,226);
        border-radius:12px;
        padding:25px;
      }

      .set-logo-section{
        text-align:center;
        margin-bottom:22px;
      }

      .set-logo-image{
        width:150px;
        height:55px;
        object-fit:contain;
        margin-bottom:18px;
      }

      .set-title{
        font-size:28px;
        color:#004a92;
        margin:0;
        font-weight:700;
      }

      .set-table{
        width:100%;
      }

      .set-table td{
        padding:10px 0;
      }

      .set-input-field{
        width:100%;
        padding:12px 15px;
        border:1px solid #e0e0e0;
        border-radius:8px;
        background:#f9f9f9;
        font-size:14px;
        outline:none;
      }

      .set-input-field:focus{
        border-color:rgb(198,207,88);
        background:white;
        box-shadow:0 0 0 3px rgba(198,207,88,0.1);
      }

      .password-note{
        margin-top:7px;
        font-size:11px;
        color:#666;
        line-height:18px;
      }

      .set-button{
        width:80%;
        padding:10px 20px;
        background:#004a92;
        color:white;
        border:none;
        border-radius:50px;
        font-size:16px;
        font-weight:600;
        cursor:pointer;
        margin:20px auto 0;
        display:flex;
        align-items:center;
        justify-content:center;
      }

      .set-button:hover{
        background:#1171d2;
      }

      .set-button:disabled{
        opacity:0.7;
        cursor:not-allowed;
      }

      .set-loading-spinner{
        width:18px;
        height:18px;
        border:2px solid #fff;
        border-top:2px solid rgb(198,207,88);
        border-radius:50%;
        margin-right:8px;
        animation:spin 0.8s linear infinite;
      }

      .set-login-section{
        margin-top:25px;
        text-align:center;
        padding-top:20px;
        border-top:1px solid #f0f0f0;
      }

      .set-login-link{
        color:#004a92;
        text-decoration:none;
        font-size:14px;
        font-weight:500;
      }

      .set-login-link:hover{
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

        .set-card-container{
          max-width:100%;
        }

        .set-button{
          width:100%;
        }

      }

      @media screen and (max-width:480px){

        .set-card-container{
          padding:15px;
        }

        .set-inner-box{
          padding:15px;
        }

        .set-logo-image{
          width:100px;
          height:45px;
        }

        .set-title{
          font-size:20px;
        }

        .set-input-field{
          font-size:12px;
          padding:10px 12px;
        }

        .set-button{
          width:100%;
          font-size:14px;
          padding:10px;
        }

      }

      `}</style>
    </>
  );

};

export default SetPassword;