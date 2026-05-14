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
    role: "",
    photo: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {

    const { name, value, files } = e.target;

    if (name === "photo") {

      setFormData((prev) => ({
        ...prev,
        photo: files[0],
      }));

    } else {

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

    }
  };

  // EMAIL VALIDATION

  const validateEmail = (email) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }

    return null;
  };

  // PASSWORD VALIDATION

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

    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      return "Password must contain special characters";
    }

    return null;
  };

  // SUBMIT

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

    if (!formData.role) {
      alert("Please select User Type");
      return;
    }

    if (!formData.photo) {
      alert("Please upload profile photo");
      return;
    }

    const allowedExtensions = ["image/jpeg", "image/png"];

    if (!allowedExtensions.includes(formData.photo.type)) {
      alert("Photo must be JPG or PNG format");
      return;
    }

    if (formData.photo.size > 5 * 1024 * 1024) {
      alert("Photo size must not exceed 5 MB");
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

      const submitData = new FormData();

      submitData.append("name", formData.name);
      submitData.append("username", formData.username);
      submitData.append("email", formData.email);
      submitData.append("contact_no", formData.contact_no);
      submitData.append("password", formData.password);
      submitData.append("confirm_password", formData.confirm_password);
      submitData.append("role", formData.role);
      submitData.append("photo", formData.photo);

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {

        alert(
          `Registration Successful!\n\nRole: ${data.role}\n\nUser account created successfully.`
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

            {/* LOGO */}

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

            {/* FORM */}

            <form onSubmit={handleSubmit}>

              <table className="register-table">

                <tbody>

                  {/* NAME */}

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

                  {/* USERNAME */}

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

                  {/* EMAIL */}

                  <tr>
                    <td>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                        autoComplete="off"
                        disabled={isLoading}
                        className="register-input-field"
                      />
                    </td>
                  </tr>

                  {/* CONTACT */}

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

                  {/* ROLE */}

                  <tr>
                    <td>

                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="register-input-field"
                      >

                        <option value="">
                          Select User Type
                        </option>

                        <option value="employee">
                          Employee
                        </option>

                        <option value="rc">
                          RC
                        </option>

                        <option value="vendor">
                          Vendors
                        </option>

                      </select>

                    </td>
                  </tr>

                  {/* PHOTO */}

                  <tr>
                    <td>

                      <div className="upload-label">
                        Upload Profile Photo
                      </div>

                      <input
                        type="file"
                        name="photo"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="register-file-input"
                      />

                    </td>
                  </tr>

                  {/* PASSWORD */}

                  <tr>
                    <td>

                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Set Password"
                        required
                        autoComplete="new-password"
                        disabled={isLoading}
                        className="register-input-field"
                      />

                      <div className="password-note">
                        Minimum 8 characters, Special character,
                        Number, Capital & Small letters
                      </div>

                    </td>
                  </tr>

                  {/* CONFIRM PASSWORD */}

                  <tr>
                    <td>
                      <input
                        type="password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        required
                        autoComplete="new-password"
                        disabled={isLoading}
                        className="register-input-field"
                      />
                    </td>
                  </tr>

                  {/* BUTTON */}

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

            {/* LOGIN */}

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
          font-family:Arial,sans-serif;
          background:white;
        }

        .register-main-container{
          min-height:100vh;
          width:100%;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:20px;
        }

        .register-card-container{
          background-color:rgb(198,207,88);
          border-radius:15px;
          padding:25px;
          width:100%;
          max-width:500px;
          box-shadow:0 10px 25px rgba(0,0,0,0.1);
        }

        .register-inner-box{
          background-color:rgb(244,243,226);
          border-radius:12px;
          padding:25px;
        }

        .register-logo-section{
          text-align:center;
          margin-bottom:22px;
        }

        .register-logo-image{
          width:150px;
          height:55px;
          object-fit:contain;
          margin-bottom:18px;
        }

        .register-title{
          font-size:28px;
          font-weight:700;
          color:#004a92;
          margin:0;
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
          border:1px solid #ddd;
          border-radius:8px;
          font-size:14px;
          background:#f9f9f9;
          outline:none;
          transition:0.3s ease;
        }

        .register-input-field:focus{
          border-color:rgb(198,207,88);
          background:white;
          box-shadow:0 0 0 3px rgba(198,207,88,0.1);
        }

        .register-file-input{
          width:100%;
          background:#f9f9f9;
          padding:12px;
          border-radius:8px;
          border:1px solid #ddd;
          cursor:pointer;
        }

        .upload-label{
          font-size:13px;
          margin-bottom:8px;
          color:#555;
          font-weight:600;
        }

        .password-note{
          margin-top:8px;
          font-size:11px;
          color:#666;
          line-height:1.5;
        }

        .register-button{
          width:80%;
          padding:10px 20px;
          border:none;
          border-radius:50px;
          background:#004a92;
          color:white;
          font-size:16px;
          font-weight:600;
          cursor:pointer;
          transition:0.3s ease;
          margin:20px auto 0;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .register-button:hover{
          background:#1171d2;
          transform:translateY(-2px);
        }

        .register-button:disabled{
          opacity:0.7;
          cursor:not-allowed;
        }

        .loading-spinner{
          width:18px;
          height:18px;
          border:2px solid #fff;
          border-top:2px solid rgb(198,207,88);
          border-radius:50%;
          margin-right:8px;
          animation:spin 0.8s linear infinite;
        }

        .register-login-section{
          margin-top:25px;
          text-align:center;
          padding-top:20px;
          border-top:1px solid #eee;
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

        /* TV */

        @media screen and (min-width:1920px){

          .register-card-container{
            max-width:580px;
          }

          .register-title{
            font-size:36px;
          }

          .register-input-field{
            font-size:16px;
            padding:15px 18px;
          }

          .register-button{
            font-size:18px;
            padding:14px;
          }
        }

        /* Tablet */

        @media screen and (max-width:768px){

          .register-card-container{
            max-width:100%;
            padding:20px;
          }

          .register-inner-box{
            padding:20px;
          }

          .register-title{
            font-size:24px;
          }

          .register-button{
            width:100%;
          }
        }

        /* Mobile */

        @media screen and (max-width:480px){

          .register-main-container{
            padding:12px;
          }

          .register-card-container{
            padding:15px;
          }

          .register-inner-box{
            padding:15px;
          }

          .register-logo-image{
            width:110px;
            height:45px;
          }

          .register-title{
            font-size:20px;
          }

          .register-input-field{
            font-size:12px;
            padding:10px 12px;
          }

          .register-button{
            width:100%;
            font-size:14px;
          }

          .password-note{
            font-size:10px;
          }

          .register-login-link{
            font-size:13px;
          }
        }

      `}</style>
    </>
  );
};

export default Register;