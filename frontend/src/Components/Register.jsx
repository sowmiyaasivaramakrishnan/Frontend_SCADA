import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/Venwind_Logo_Final.png";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        contact_no: "",
        password: "",
        confirm_password: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return "Please enter a valid email address";
        }

        return null;
    };
    const validatePassword = (password) => {
        if (password.length < 8) {
            return "Password must contain minimum 8 characters";
        }

        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one Capital letter";
        }

        if (!/[a-z]/.test(password)) {
            return "Password must contain lowercase letters";
        }

        if (!/[0-9]/.test(password)) {
            return "Password must contain numbers";
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return "Password must contain special characters";
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            alert("Please enter Full Name");
            return;
        }
        if (!formData.username.trim()) {
            alert("Please enter Username");
            return;
        }
        const emailError = validateEmail(formData.email);

        if (emailError) {
            alert(emailError);
            return;
        }
        if (!/^\d{10}$/.test(formData.contact_no)) {
            alert("Contact number must be exactly 10 digits");
            return;
        }
        const passwordError = validatePassword(formData.password);

        if (passwordError) {
            alert(passwordError);
            return;
        }
        if (formData.password !== formData.confirm_password) {
            alert("Wrong Password - Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert(
                    "Registration Successful!\n\nYour account has been created successfully."
                );

                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            } else {
                const errorMessage =
                    data.detail ||
                    data.message ||
                    "Registration failed. Please try again.";

                alert(errorMessage);
            }
        } catch (err) {
            console.error("Registration Error:", err);

            const errorMsg =
                err instanceof Error
                    ? err.message
                    : "Network error. Please check your connection.";

            alert(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="register-main-container">
                <div className="register-card-container">
                    <div className="register-inner-box">
                        <div className="register-logo-section">
                            <img
                                src={logoImage}
                                alt="Venwind Logo"
                                className="register-logo-image"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />

                            <h5 className="register-title">
                                CREATE ACCOUNT
                            </h5>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <table className="register-table">
                                <tbody>
                                    <tr>
                                        <td>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Full Name"
                                                required
                                                disabled={isLoading}
                                                className="register-input-field"
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                placeholder="Username"
                                                required
                                                disabled={isLoading}
                                                className="register-input-field"
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Email"
                                                required
                                                disabled={isLoading}
                                                className="register-input-field"
                                            />
                                        </td>
                                    </tr>

                                   

                                    <tr>
                                        <td>
                                            <input
                                                type="tel"
                                                name="contact_no"
                                                value={formData.contact_no}
                                                onChange={handleChange}
                                                placeholder="Contact Number"
                                                maxLength="10"
                                                required
                                                disabled={isLoading}
                                                className="register-input-field"
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Set Password"
                                                required
                                                disabled={isLoading}
                                                className="register-input-field"
                                            />

                                            {/* <div className="password-note">
                        Min 8 characters, Special character,
                        Numbers, Capital & Small letters
                      </div> */}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <input
                                                type="password"
                                                name="confirm_password"
                                                value={formData.confirm_password}
                                                onChange={handleChange}
                                                placeholder="Confirm Password"
                                                required
                                                disabled={isLoading}
                                                className="register-input-field"
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="register-button"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <span className="loading-spinner"></span>
                                                        Creating...
                                                    </>
                                                ) : (
                                                    "Register"
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>

                        <div className="register-login-section">
                            <a
                                href="/login"
                                className="register-login-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate("/login");
                                }}
                            >
                                Already Have Account? - SignIn
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

        .register-main-container{
          min-height:100vh;
          width:100%;
          display:flex;
          align-items:center;
          justify-content:center;
          background-color:white;
          padding:20px;
        }

        .register-card-container{
          background-color:rgb(198, 207, 88);
          border-radius:15px;
          padding:25px;
          box-shadow:0 10px 25px rgba(0,0,0,0.1);
          width:100%;
          max-width:470px;
        }

        .register-inner-box{
          background-color:rgb(244, 243, 226);
          border-radius:12px;
          padding:25px;
          box-shadow:0 2px 10px rgba(225,190,64,0.05);
        }

        .register-logo-section{
          margin-bottom:22px;
          text-align:center;
        }

        .register-logo-image{
          width:150px;
          height:55px;
          object-fit:contain;
          display:block;
          margin:0 auto 18px;
        }

        .register-title{
          font-size:28px;
          font-weight:700;
          color:#004a92;
          margin:0;
          letter-spacing:1px;
        }

        .register-table{
          width:100%;
          border-collapse:collapse;
        }

        .register-table td{
          padding:9px 0;
        }

        .register-input-field{
          width:100%;
          padding:12px 15px;
          border:1px solid #e0e0e0;
          border-radius:8px;
          font-size:14px;
          background-color:#f9f9f9;
          transition:all 0.3s ease;
          outline:none;
        }

        .register-input-field:focus{
          border-color:rgb(198, 207, 88);
          background-color:white;
          box-shadow:0 0 0 3px rgba(198,207,88,0.1);
        }

        .register-input-field::placeholder{
          color:#999;
          font-size:14px;
        }

        .password-note{
          margin-top:7px;
          font-size:11px;
          color:#666;
          line-height:1.5;
          padding-left:2px;
        }

        .register-button{
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

        .register-button:hover{
          background-color:#1171d2;
          transform:translateY(-2px);
          box-shadow:0 4px 12px rgba(198,207,88,0.3);
        }

        .register-button:disabled{
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

        .register-login-section{
          margin-top:25px;
          text-align:center;
          padding-top:20px;
          border-top:1px solid #f0f0f0;
        }

        .register-login-link{
          color:#004a92;
          text-decoration:none;
          font-size:14px;
          font-weight:500;
        }

        .register-login-link:hover{
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

        /* 4K & TV */

        @media screen and (min-width: 1920px){

          .register-card-container{
            max-width:540px;
          }

          .register-inner-box{
            padding:35px;
          }

          .register-title{
            font-size:34px;
          }

          .register-input-field{
            font-size:16px;
            padding:15px 18px;
          }

          .register-button{
            font-size:18px;
            padding:14px 20px;
          }
        }

        /* Laptop */

        @media screen and (max-width: 1440px){

          .register-card-container{
            max-width:470px;
          }
        }

        /* Tablet */

        @media screen and (max-width: 768px){

          .register-main-container{
            padding:15px;
          }

          .register-card-container{
            width:100%;
            max-width:100%;
            padding:20px;
          }

          .register-inner-box{
            padding:20px;
          }

          .register-logo-image{
            width:120px;
            height:50px;
          }

          .register-title{
            font-size:24px;
          }

          .register-input-field{
            padding:11px 14px;
            font-size:13px;
          }

          .register-button{
            width:100%;
            font-size:15px;
          }
        }

        /* Mobile */

        @media screen and (max-width: 480px){

          .register-main-container{
            padding:12px;
          }

          .register-card-container{
            padding:15px;
            border-radius:12px;
          }

          .register-inner-box{
            padding:15px;
          }

          .register-logo-image{
            width:100px;
            height:45px;
            margin-bottom:15px;
          }

          .register-title{
            font-size:20px;
          }

          .register-input-field{
            padding:10px 12px;
            font-size:12px;
          }

          .password-note{
            font-size:10px;
          }

          .register-button{
            width:100%;
            padding:10px;
            font-size:14px;
          }

          .register-login-link{
            font-size:13px;
          }
        }

        /* Small Height Screens */

        @media screen and (max-height: 700px){

          .register-main-container{
            padding:10px;
          }

          .register-card-container{
            padding:15px;
          }

          .register-inner-box{
            padding:15px;
          }

          .register-logo-section{
            margin-bottom:18px;
          }

          .register-title{
            font-size:20px;
          }
        }

      `}</style>
        </>
    );
};

export default Register;