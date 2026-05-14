import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaFolderOpen,
  FaUsers,
  FaFileAlt,
  FaChartLine,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaGlobe,
  FaUserCircle,
  FaChevronDown,
  FaCamera,
  FaEdit,
} from "react-icons/fa";

import logoImage from "../assets/Venwind_Logo_Final.png";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://10.5.25.189:8000";

const Dashboard = () => {
  const fileInputRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAllActivityModal, setShowAllActivityModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liveIP, setLiveIP] = useState(null);
  const [recentLogins, setRecentLogins] = useState([]);
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    contact_no: "",
    role: "",
    photo: "",
    newPassword: "",
    confirmPassword: "",
    photoFile: null,
  });

  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetData, setResetData] = useState({
    email: "",
    otp: "",
    new_password: "",
    confirm_password: "",
  });

  const navigate = useNavigate();

  // Close mobile menu on window resize (if screen becomes large)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992 && showMobileMenu) {
        setShowMobileMenu(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showMobileMenu]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const storedUsername = localStorage.getItem("username");
      const storedEmail = localStorage.getItem("email");
      let userURL = `${API_BASE_URL}/get_users?`;

      if (storedUsername) {
        userURL += `username=${encodeURIComponent(storedUsername)}`;
      } else if (storedEmail) {
        userURL += `email=${encodeURIComponent(storedEmail)}`;
      }
      const response = await fetch(userURL);
      const data = await response.json();
      if (response.ok && data.status === "success" && data.data.length > 0) {
        const user = data.data[0];
        const profilePhoto = user.photo
          ? `${API_BASE_URL}/${user.photo.replace(/\\/g, "/")}`
          : "https://i.pravatar.cc/300";

        setUserData((prev) => ({
          ...prev,
          name: user.name || "",
          username: user.username || "",
          email: user.email || "",
          contact_no: user.contact_no || "",
          role: user.role || "",
          photo: profilePhoto,
        }));
        fetchLiveIP(user.username, user.email);
        fetchIPHistory(user.username, user.email);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveIP = async (username, email) => {
    try {
      let url = `${API_BASE_URL}/get_live_ip`;
      const params = [];
      if (username) {
        params.push(`username=${encodeURIComponent(username)}`);
      }
      if (email) {
        params.push(`email=${encodeURIComponent(email)}`);
      }
      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok && data.status === "success") {
        setLiveIP(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchIPHistory = async (username, email) => {
    try {
      let url = `${API_BASE_URL}/get_ip_history?`;
      if (username) {
        url += `username=${encodeURIComponent(username)}`;
      } else if (email) {
        url += `email=${encodeURIComponent(email)}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok && data.status === "success") {
        setRecentLogins(data.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setUserData((prev) => ({
        ...prev,
        photo: imageURL,
        photoFile: file,
      }));
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const identifier = userData.email || userData.username;
      const formData = new FormData();

      formData.append("identifier", identifier);
      formData.append("name", userData.name);
      formData.append("username", userData.username);
      formData.append("email", userData.email);
      formData.append("contact_no", userData.contact_no);

      if (userData.newPassword) {
        formData.append("password", userData.newPassword);
        formData.append("confirm_password", userData.confirmPassword);
      }

      if (userData.photoFile) {
        formData.append("photo", userData.photoFile);
      }
      const response = await fetch(`${API_BASE_URL}/update_profile`, {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();
      if (response.ok && data.status === "success") {
        alert("Profile Updated Successfully");
        const updatedUser = data.data;
        const updatedPhoto = updatedUser.photo
          ? `${API_BASE_URL}/${updatedUser.photo.replace(/\\/g, "/")}`
          : userData.photo;

        setUserData((prev) => ({
          ...prev,
          name: updatedUser.name,
          username: updatedUser.username,
          email: updatedUser.email,
          contact_no: updatedUser.contact_no,
          role: updatedUser.role,
          photo: updatedPhoto,
          newPassword: "",
          confirmPassword: "",
          photoFile: null,
        }));
        localStorage.setItem("username", updatedUser.username);
        localStorage.setItem("email", updatedUser.email);
        localStorage.setItem("user_name", updatedUser.name);
        localStorage.setItem("role", updatedUser.role);
        setShowProfileModal(false);
      } else {
        alert(data.detail || data.message || "Profile update failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleResetInputChange = (e) => {
    const { name, value } = e.target;
    setResetData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendOTP = async () => {
    try {
      setResetLoading(true);
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: resetData.email,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("OTP sent successfully to your email");
      } else {
        alert(data.detail || data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setResetLoading(true);
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: resetData.email,
          otp: resetData.otp,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpVerified(true);
        alert("OTP Verified Successfully");
      } else {
        alert(data.detail || "Invalid OTP");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      if (resetData.new_password !== resetData.confirm_password) {
        alert("Passwords do not match");
        return;
      }
      setResetLoading(true);
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: resetData.email,
          new_password: resetData.new_password,
          confirm_password: resetData.confirm_password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Password Reset Successful");
        setShowResetPasswordModal(false);
        setOtpVerified(false);
        setResetData({
          email: "",
          otp: "",
          new_password: "",
          confirm_password: "",
        });
      } else {
        alert(data.detail || "Password reset failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setResetLoading(false);
    }
  };

  // Navigation handler that closes mobile menu
  const handleNavigation = (path) => {
    navigate(path);
    setShowMobileMenu(false);
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-wrapper">
        {/* Top Navbar */}
        <div className="top-navbar">
          <div className="top-navbar-left">
            <img
              src={logoImage}
              alt="Logo"
              className="top-logo"
              onClick={() => handleNavigation("/dashboard")}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className="top-navbar-center">
            <div
              className="top-menu-item active"
              onClick={() => handleNavigation("/dashboard")}
            >
              <FaChartLine />
              <span>Dashboard</span>
            </div>
            <div
              className="top-menu-item"
              onClick={() => handleNavigation("/alarms")}
            >
              <FaBell />
              <span>Alarms</span>
            </div>
            <div
              className="top-menu-item"
              onClick={() => handleNavigation("/projects")}
            >
              <FaFolderOpen />
              <span>Projects</span>
            </div>
            <div
              className="top-menu-item"
              onClick={() => handleNavigation("/users")}
            >
              <FaUsers />
              <span>Users</span>
            </div>
            <div
              className="top-menu-item"
              onClick={() => handleNavigation("/reports")}
            >
              <FaFileAlt />
              <span>Reports</span>
            </div>
            <div
              className="top-menu-item"
              onClick={() => handleNavigation("/help")}
            >
              <FaQuestionCircle />
              <span>Help</span>
            </div>
          </div>
          <div className="mobile-menu-btn">
            <FaBars onClick={() => setShowMobileMenu(true)} />
          </div>
        </div>

        {/* Mobile Sidebar (Offcanvas) */}
        {showMobileMenu && (
          <div className="mobile-sidebar-overlay">
            <div className="mobile-sidebar">
              <div className="mobile-sidebar-header">
                <img src={logoImage} alt="Logo" className="mobile-logo" />
                <button
                  className="close-mobile-btn"
                  onClick={() => setShowMobileMenu(false)}
                >
                  ✕
                </button>
              </div>
              <div className="mobile-sidebar-menu">
                <div
                  className="mobile-sidebar-item active"
                  onClick={() => handleNavigation("/dashboard")}
                >
                  <FaChartLine />
                  <span>Dashboard</span>
                </div>
                <div
                  className="mobile-sidebar-item"
                  onClick={() => handleNavigation("/alarms")}
                >
                  <FaBell />
                  <span>Alarms</span>
                </div>
                <div
                  className="mobile-sidebar-item"
                  onClick={() => handleNavigation("/projects")}
                >
                  <FaFolderOpen />
                  <span>Projects</span>
                </div>
                <div
                  className="mobile-sidebar-item"
                  onClick={() => handleNavigation("/users")}
                >
                  <FaUsers />
                  <span>Users</span>
                </div>
                <div
                  className="mobile-sidebar-item"
                  onClick={() => handleNavigation("/reports")}
                >
                  <FaFileAlt />
                  <span>Reports</span>
                </div>
                <div
                  className="mobile-sidebar-item"
                  onClick={() => handleNavigation("/help")}
                >
                  <FaQuestionCircle />
                  <span>Help</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="dashboard-main">
          <div className="dashboard-navbar">
            <div className="navbar-left"></div>
            <div className="navbar-right">
              {/* Desktop Tracking */}
              <div className="tracking-ip desktop-tracking">
                <FaGlobe />
                <h5>Tracking IP</h5>
                <span>
                  {liveIP?.location?.private_ip ||
                    liveIP?.ip ||
                    "Loading..."}
                </span>
              </div>

              {/* Mobile Separate Cards */}
              <div className="mobile-top-info">
                {/* Tracking Card */}
                <div className="tracking-ip mobile-tracking">
                  <FaGlobe />

                  <div className="mobile-info-text">
                    <h5>Tracking IP</h5>

                    <span>
                      {liveIP?.location?.private_ip ||
                        liveIP?.ip ||
                        "Loading..."}
                    </span>
                  </div>
                </div>

                {/* Employee Card */}
                <div className="mobile-employee-card">
                  <img
                    src={userData.photo}
                    alt="Profile"
                    className="mobile-profile-image"
                  />

                  <div className="mobile-employee-details">
                    <h4>{userData.name}</h4>

                    <p>
                      {userData.role
                        ? userData.role.charAt(0).toUpperCase() +
                        userData.role.slice(1).toLowerCase()
                        : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notification */}
              <div className="notification-icon">
                <FaBell />
                <span className="notification-badge">3</span>
              </div>

              {/* Desktop Profile */}
              <div className="profile-wrapper">
                <div
                  className="profile-section"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <img
                    src={userData.photo}
                    alt="Profile"
                    className="profile-image"
                  />

                  <div className="profile-details">
                    <h4>{userData.name}</h4>

                    <p>
                      {userData.role
                        ? userData.role.charAt(0).toUpperCase() +
                        userData.role.slice(1).toLowerCase()
                        : ""}
                    </p>
                  </div>

                  <FaChevronDown />
                </div>

                {showDropdown && (
                  <div className="profile-dropdown">
                    <div
                      className="dropdown-item"
                      onClick={() => {
                        setShowProfileModal(true);
                        setShowDropdown(false);
                      }}
                    >
                      <FaUserCircle />
                      Profile
                    </div>

                    <div
                      className="dropdown-item"
                      onClick={() => {
                        setShowResetPasswordModal(true);
                        setShowDropdown(false);
                      }}
                    >
                      <FaEdit />
                      Reset Password
                    </div>

                    <div
                      className="dropdown-item logout-item"
                      onClick={() => {
                        const confirmLogout = window.confirm(
                          "Are you sure you want to logout?"
                        );

                        if (confirmLogout) {
                          handleLogout();
                        }
                      }}
                    >
                      <FaSignOutAlt />
                      Logout
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="dashboard-content">
            <div className="dashboard-left-content">
              <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>
                  Welcome back, {userData.name}! Here's what's happening with
                  your projects.
                </p>
              </div>

              <div className="stats-grid">
                <div className="stats-card">
                  <div className="stats-icon green">
                    <FaFolderOpen />
                  </div>
                  <div>
                    <h2>24</h2>
                    <p>Total Projects</p>
                  </div>
                </div>

                <div className="stats-card">
                  <div className="stats-icon blue">
                    <FaUsers />
                  </div>
                  <div>
                    <h2>156</h2>
                    <p>Total Users</p>
                  </div>
                </div>

                <div className="stats-card">
                  <div className="stats-icon yellow">
                    <FaFileAlt />
                  </div>
                  <div>
                    <h2>89</h2>
                    <p>Total Reports</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="activity-panel">
              <div className="activity-header">
                <h5>Recent Activity</h5>
              </div>

              <div className="current-session-card">
                <div className="card-title">
                  <div className="active-status"></div>
                  Current Session
                </div>
                <div className="session-row">
                  <span>IP Address</span>
                  <strong>{liveIP?.location?.private_ip}</strong>
                </div>
                <div className="session-row">
                  <span>Location</span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <strong>{liveIP?.location?.city}</strong>
                    <span>,</span>
                    <strong>{liveIP?.location?.region}</strong>
                  </div>
                </div>
                <div className="session-row">
                  <span>Date</span>
                  <strong>
                    {liveIP?.login_datetime
                      ? new Date(liveIP.login_datetime).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                      : "--"}
                  </strong>
                </div>
                <div className="session-row">
                  <span>Device</span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <strong>{liveIP?.device?.browser}</strong>
                    <span>/</span>
                    <strong>{liveIP?.device?.type}</strong>
                  </div>
                </div>
              </div>

              <div className="recent-logins">
                <h5>Recent Logins</h5>
                <div className="recent-login-table">
                  {recentLogins.slice(0, 3).map((item, index) => (
                    <React.Fragment key={index}>
                      <div className="recent-login-row">
                        <div className="recent-login-left">
                          <div className="history-left">
                            <div
                              className={
                                index === 0
                                  ? "status-dot active-dot"
                                  : "status-dot"
                              }
                            ></div>
                            <strong>{item.private_ip}</strong>
                          </div>
                          <p>
                            {item.city}, {item.region}
                          </p>
                        </div>

                        <div className="recent-login-right">
                          {index === 0 && (
                            <span className="current-tag">Active</span>
                          )}
                          <span className="login-device">
                            {item.browser} • {item.login_date}
                          </span>
                        </div>
                      </div>
                      {index !== 2 && index !== recentLogins.length - 1 && (
                        <hr className="login-divider" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                {recentLogins.length > 3 && (
                  <button
                    className="view-all-btn"
                    onClick={() => setShowAllActivityModal(true)}
                  >
                    View All Activity Logs
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="modal-overlay">
          <div className="reset-password-modal">
            <div className="modal-header">
              <div>
                <h4>Reset Password</h4>
                <p>Secure your account with a new password</p>
              </div>
              <button
                className="close-btn"
                onClick={() => {
                  setShowResetPasswordModal(false);
                  setOtpVerified(false);
                }}
              >
                ✕
              </button>
            </div>
            <div className="reset-form-container">
              <div className="form-group full-width">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={resetData.email}
                  onChange={handleResetInputChange}
                  placeholder="Enter your email"
                />
              </div>
              <button
                className="otp-btn"
                onClick={handleSendOTP}
                disabled={resetLoading}
              >
                {resetLoading ? "Sending..." : "Send OTP"}
              </button>
              <div className="form-group full-width">
                <label>Enter OTP</label>
                <input
                  type="text"
                  name="otp"
                  value={resetData.otp}
                  onChange={handleResetInputChange}
                  placeholder="Enter OTP"
                />
              </div>
              <button
                className="verify-btn"
                onClick={handleVerifyOTP}
                disabled={resetLoading}
              >
                Verify OTP
              </button>
              {otpVerified && (
                <>
                  <div className="form-group full-width">
                    <label>New Password</label>
                    <input
                      type="password"
                      name="new_password"
                      value={resetData.new_password}
                      onChange={handleResetInputChange}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      name="confirm_password"
                      value={resetData.confirm_password}
                      onChange={handleResetInputChange}
                      placeholder="Confirm password"
                    />
                  </div>
                  <button className="save-btn" onClick={handleResetPassword}>
                    Reset Password
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* All Activity Modal */}
      {showAllActivityModal && (
        <div className="modal-overlay">
          <div className="activity-modal">
            <div className="modal-header">
              <div>
                <h4>Complete Login Activity</h4>
                <p>Entire IP login history details</p>
              </div>
              <button
                className="close-btn"
                onClick={() => setShowAllActivityModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="activity-table-wrapper">
              <table className="activity-history-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Private IP</th>
                    <th>Location</th>
                    <th>Browser</th>
                    <th>Device</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogins.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="table-status">
                          <div
                            className={
                              index === 0 ? "status-dot active-dot" : "status-dot"
                            }
                          ></div>
                          {index === 0 ? "Active" : "History"}
                        </div>
                      </td>
                      <td>{item.private_ip}</td>
                      <td>
                        {item.city}, {item.region}
                      </td>
                      <td>{item.browser}</td>
                      <td>{item.device_type}</td>
                      <td>
                        {item.login_date}
                        <br />
                        <span className="table-time">{item.login_time}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="profile-modal">
            <div className="modal-header">
              <div>
                <h4>Edit Profile</h4>
                <p>Update your profile details</p>
              </div>
              <button
                className="close-btn"
                onClick={() => setShowProfileModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="profile-upload-section">
              <div className="profile-image-wrapper">
                <img
                  src={userData.photo}
                  alt="Profile"
                  className="edit-profile-image"
                />
                <button
                  className="camera-btn"
                  onClick={() => fileInputRef.current.click()}
                >
                  <FaCamera />
                </button>
              </div>
              <input
                type="file"
                hidden
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </div>
            <div className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={userData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="text"
                  name="contact_no"
                  value={userData.contact_no}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={userData.role}
                  disabled
                  className="disabled-input"
                />
              </div>
              <button className="save-btn" onClick={handleProfileUpdate}>
                <FaEdit />
                Update Profile
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Inter", sans-serif;
        }

        html,
        body {
          width: 100%;
          overflow-x: hidden;
          background: #f5f7fb;
          margin: 0;
          padding: 0;
        }

        body {
          min-height: 100vh;
          margin: 0;
          padding: 0;
        }
        #root {
          width: 1530px;
          max-width: 100%;
          margin: 0 auto;
          text-align: center;
          border-inline: 1px solid var(--border);
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        .loader-container {
          width: 100%;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f5f7fb;
          margin: 0;
          padding: 0;
        }

        .loader {
          width: 48px;
          height: 48px;
          border: 5px solid #e5e7eb;
          border-top: 5px solid #6d28d9;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }

        .dashboard-wrapper {
          width: 100%;
          min-height: 100vh;
          background: #f5f7fb;
          margin: 0;
          padding: 0;
        }

        .top-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 78px;
          background: #081b34;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0;
          z-index: 999;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
        }

        .top-navbar-left {
          display: flex;
          align-items: center;
          padding-left: 20px;
        }

        .top-logo {
          width: 135px;
          object-fit: contain;
          background: white;
        }

        .top-navbar-center {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .top-menu-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          border-radius: 14px;
          color: white;
          cursor: pointer;
          transition: 0.3s ease;
          font-size: 14px;
          font-weight: 600;
        }

        .top-menu-item:hover,
        .top-menu-item.active {
          background: #b8d63c;
          color: #111827;
        }

        .mobile-menu-btn {
          display: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding-right: 20px;
        }

        .mobile-sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9999;
        }

        .mobile-sidebar {
          width: 290px;
          height: 100%;
          background: white;
          padding: 22px;
          overflow-y: auto;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .mobile-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }

        .mobile-logo {
          width: 120px;
        }

        .close-mobile-btn {
          width: 40px;
          height: 40px;
          border: none;
          background: #f3f4f6;
          border-radius: 12px;
          cursor: pointer;
          font-size: 18px;
        }

        .mobile-sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mobile-sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          border-radius: 14px;
          cursor: pointer;
          transition: 0.3s ease;
          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }

        .mobile-sidebar-item:hover,
        .mobile-sidebar-item.active {
          background: #b8d63c;
        }

        .dashboard-main {
          width: 100%;
          min-height: 100vh;
          margin-top: 78px;
          padding: 0;
        }

        .dashboard-navbar {
          width: 100%;
          min-height: 78px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 0;
          border-bottom: 1px solid #edf2f7;
        }

        .navbar-left {
          padding-left: 20px;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          padding-right: 20px;
        }

        .tracking-ip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          border-radius: 40px;
          background: #eef9e8;
          border: 1px solid #d9efcb;
          color: #166534;
          font-size: 14px;
          font-weight: 700;
        }

        .notification-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
        }

        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: red;
          color: white;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .profile-wrapper {
          position: relative;
        }

        .profile-section {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f8fafc;
          border: 1px solid #edf2f7;
          padding: 6px 14px;
          border-radius: 50px;
          cursor: pointer;
          transition: 0.3s ease;
        }

        .profile-section:hover {
          background: #eef2ff;
        }
        /* ========================= */
/* Desktop / Mobile Navbar */
/* ========================= */

.desktop-tracking {
  display: flex;
}

.mobile-top-info {
  display: none;
  width: 100%;
  gap: 12px;
  align-items: stretch;
}

.mobile-tracking {
  flex: 1;
  border-radius: 18px;
  padding: 12px 14px;
  align-items: center;
}

.mobile-info-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mobile-info-text h5 {
  font-size: 12px;
  margin: 0;
  font-weight: 700;
}

.mobile-info-text span {
  font-size: 11px;
  font-weight: 700;
}

.mobile-employee-card {
  flex: 1;
  background: #f8fafc;
  border: 1px solid #edf2f7;
  border-radius: 18px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.mobile-profile-image {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #dbeafe;
}

.mobile-employee-details {
  display: flex;
  flex-direction: column;
}

.mobile-employee-details h4 {
  font-size: 13px;
  color: #111827;
  font-weight: 700;
  margin: 0;
}

.mobile-employee-details p {
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
  text-transform: capitalize;
}

        .profile-image {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #dbeafe;
        }

        .profile-details {
          display: flex;
          flex-direction: column;
        }

        .profile-details h4 {
          font-size: 14px;
          font-weight: 700;
          color: #111827;
        }

        .profile-details p {
          font-size: 11px;
          color: #6b7280;
          margin-top: 2px;
          text-transform: capitalize;
        }

        .profile-dropdown {
          position: absolute;
          top: 72px;
          right: 0;
          width: 210px;
          background: white;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
          z-index: 100;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: 0.3s ease;
        }

        .dropdown-item:hover {
          background: #f8fafc;
        }

        .logout-item {
          color: red;
        }

        .dashboard-content {
          width: 100%;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 360px;
          gap: 18px;
          padding: 16px 0;
          align-items: start;
        }

        .dashboard-left-content {
          width: 100%;
          min-width: 0;
          padding-left: 20px;
          padding-right: 0;
        }

        .dashboard-header h1 {
          font-size: 28px;
          font-weight: 600;
          color: #111827;
          margin: 0;
          margin-left: -5px;
        }

        .dashboard-header p {
          font-size: 15px;
          color: #070707;
          margin-top: 6px;
          margin-bottom: 0;
        }

        .stats-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 20px;
        }

        .stats-card {
          width: 100%;
          background: white;
          border-radius: 20px;
          padding: 22px;
          display: flex;
          align-items: center;
          gap: 18px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        .stats-icon {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 22px;
        }

        .green {
          background: #72c63b;
        }

        .blue {
          background: #3b82f6;
        }

        .yellow {
          background: #f4b400;
        }

        .stats-card h2 {
          font-size: 28px;
          font-weight: 800;
          color: #111827;
          margin: 0;
        }

        .stats-card p {
          font-size: 13px;
          color: #6b7280;
          margin-top: 4px;
          margin-bottom: 0;
        }

        .activity-panel {
          width: 100%;
          background: white;
          border-radius: 20px;
          padding: 22px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          margin-right: 20px;
        }

        .activity-header h5 {
          font-size: 20px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 10px;
        }

        .current-session-card {
          margin-top: 22px;
          background: #eef9e8;
          border: 1px solid #d9efcb;
          border-radius: 20px;
          padding: 20px;
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          font-size: 17px;
          font-weight: 800;
          color: #166534;
        }

        .active-status {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #22c55e;
        }

        .session-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 16px;
        }

        .session-row span {
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
        }

        .session-row strong {
          font-size: 13px;
          font-weight: 700;
          color: #111827;
          text-align: right;
        }

        .recent-logins {
          margin-top: 24px;
        }

        .recent-logins h5 {
          font-size: 20px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 16px;
        }

        .recent-login-table {
          width: 100%;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          overflow: hidden;
        }

        .recent-login-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 18px;
        }

        .recent-login-left {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .history-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .history-left strong {
          font-size: 14px;
          color: #111827;
          font-weight: 700;
        }

        .recent-login-left p {
          font-size: 12px;
          color: #6b7280;
          margin: 0;
        }

        .recent-login-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .login-device {
          font-size: 12px;
          color: #64748b;
        }

        .login-divider {
          border: none;
          border-top: 1px solid #edf2f7;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #3b82f6;
        }

        .active-dot {
          background: #22c55e;
        }

        .current-tag {
          background: #dcfce7;
          color: #15803d;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 800;
        }

        .view-all-btn {
          width: 100%;
          height: 48px;
          margin-top: 16px;
          border: none;
          border-radius: 16px;
          background: #081b34;
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s ease;
        }

        .view-all-btn:hover {
          background: #0f2c53;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .profile-modal {
          width: 100%;
          max-width: 640px;
          background: white;
          border-radius: 24px;
          padding: 28px;
          max-height: 95vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 28px;
        }

        .modal-header h4 {
          font-size: 24px;
          font-weight: 800;
          color: #111827;
          margin: 0;
        }

        .modal-header p {
          font-size: 13px;
          color: #6b7280;
          margin-top: 5px;
          margin-bottom: 0;
        }

        .close-btn {
          width: 42px;
          height: 42px;
          border: none;
          background: #f3f4f6;
          border-radius: 12px;
          cursor: pointer;
          font-size: 18px;
        }

        .profile-upload-section {
          display: flex;
          justify-content: center;
          margin-bottom: 26px;
        }

        .profile-image-wrapper {
          position: relative;
        }

        .edit-profile-image {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          object-fit: cover;
          border: 5px solid #eef2ff;
        }

        .camera-btn {
          position: absolute;
          right: 4px;
          bottom: 4px;
          width: 46px;
          height: 46px;
          border: none;
          border-radius: 50%;
          background: #6d28d9;
          color: white;
          cursor: pointer;
          font-size: 16px;
        }

        .profile-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }

        .form-group input {
          width: 100%;
          height: 52px;
          border: 1px solid #dbe2ea;
          border-radius: 16px;
          padding: 0 16px;
          font-size: 14px;
        }

        .form-group input:focus {
          outline: none;
          border-color: #6d28d9;
        }

        .disabled-input {
          background: #f3f4f6;
          cursor: not-allowed;
        }

        .save-btn {
          grid-column: span 2;
          width: 220px;
          height: 54px;
          border: none;
          border-radius: 28px;
          background: #004a92;
          color: white;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 20px auto 0 auto;
        }

        .reset-password-modal {
          width: 100%;
          max-width: 520px;
          background: white;
          border-radius: 24px;
          padding: 28px;
          max-height: 95vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }

        .reset-form-container {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .full-width {
          width: 100%;
        }

        .otp-btn,
        .verify-btn {
          width: 45%;
          height: 52px;
          border: none;
          border-radius: 26px;
          background: #004a92;
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
          align-items: center;
          justify-content: center;
          margin: 20px auto;
        }

        .otp-btn:hover,
        .verify-btn:hover {
          background: #1171d2;
        }

        .otp-btn:disabled,
        .verify-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .activity-modal {
          width: 100%;
          max-width: 1100px;
          background: white;
          border-radius: 24px;
          padding: 28px;
          max-height: 92vh;
          overflow-y: auto;
        }

        .activity-table-wrapper {
          width: 100%;
          overflow-x: auto;
          margin-top: 20px;
        }

        .activity-history-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 850px;
        }

        .activity-history-table thead {
          background: #081b34;
        }

        .activity-history-table th {
          color: white;
          padding: 16px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
        }

        .activity-history-table td {
          padding: 16px;
          border-bottom: 1px solid #edf2f7;
          font-size: 13px;
          color: #374151;
        }

        .activity-history-table tbody tr:hover {
          background: #f8fafc;
        }

        .table-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
        }

        .table-time {
          color: #6b7280;
          font-size: 11px;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .dashboard-content {
            grid-template-columns: 1fr;
          }

          .activity-panel {
            margin-right: 20px;
            margin-left: 20px;
            width: calc(100% - 40px);
          }
        }

        @media (max-width: 992px) {
          .top-navbar-center {
            display: none;
          }

          .mobile-menu-btn {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
  .dashboard-navbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .navbar-right {
    width: 100%;
    justify-content: space-between;
    padding-right: 20px;
  }

  .dashboard-content {
    padding: 16px 0;
  }

  .dashboard-left-content {
    padding-left: 20px;
    padding-right: 20px;
  }

  .activity-panel {
    margin-right: 20px;
    margin-left: 20px;
    width: calc(100% - 40px);
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .profile-form {
    grid-template-columns: 1fr;
  }

  .save-btn {
    grid-column: span 1;
    width: 100%;
  }

  .recent-login-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .recent-login-right {
    align-items: flex-start;
  }

  /* Mobile Navbar */

  .desktop-tracking {
    display: none;
  }

  .mobile-top-info {
    display: flex;
  }

  .profile-section {
    display: none;
  }

  .navbar-right {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
  }

  .notification-icon {
    align-self: flex-end;
  }
}

        @media (max-width: 480px) {
  .top-navbar {
    padding: 0;
  }

  .top-navbar-left {
    padding-left: 15px;
  }

  .mobile-menu-btn {
    padding-right: 15px;
  }

  .dashboard-content {
    padding: 12px 0;
  }

  .dashboard-left-content {
    padding-left: 15px;
    padding-right: 15px;
  }

  .activity-panel {
    margin-right: 15px;
    margin-left: 15px;
    width: calc(100% - 30px);
  }

  .navbar-left {
    padding-left: 15px;
  }

  .navbar-right {
    padding-right: 15px;
  }

  .mobile-top-info {
    flex-direction: column;
  }

  .mobile-tracking,
  .mobile-employee-card {
    width: 100%;
  }

  .dashboard-header h1 {
    font-size: 26px;
  }

  .profile-modal {
    padding: 18px;
    border-radius: 20px;
  }

  .mobile-sidebar {
    width: 100%;
  }

  .reset-password-modal {
    padding: 20px;
    border-radius: 20px;
  }

        }
      `}</style>
    </>
  );
};

export default Dashboard;