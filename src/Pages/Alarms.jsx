import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaFolderOpen,
  FaUsers,
  FaFileAlt,
  FaChartLine,
  FaQuestionCircle,
  FaSignOutAlt,
  FaGlobe,
  FaUserCircle,
  FaChevronDown,
  FaEdit,
  FaExclamationTriangle,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaFilter,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";

import logoImage from "../assets/Venwind_Logo_Final.png";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://10.5.25.189:8000";

const Alarms = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liveIP, setLiveIP] = useState(null);
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
  const [alarms, setAlarms] = useState([]);
  const [filteredAlarms, setFilteredAlarms] = useState([]);
  const [selectedAlarm, setSelectedAlarm] = useState(null);
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "timestamp", direction: "desc" });
  const [acknowledging, setAcknowledging] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetData, setResetData] = useState({
    email: "",
    otp: "",
    new_password: "",
    confirm_password: "",
  });

  const fileInputRef = useRef(null);

  // Close mobile menu on window resize
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
    fetchAlarms();
  }, []);

  useEffect(() => {
    filterAndSortAlarms();
  }, [alarms, filterStatus, searchTerm, sortConfig]);

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
      if (username) params.push(`username=${encodeURIComponent(username)}`);
      if (email) params.push(`email=${encodeURIComponent(email)}`);
      if (params.length > 0) url += `?${params.join("&")}`;
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok && data.status === "success") setLiveIP(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAlarms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/alarms`);
      const data = await response.json();
      if (response.ok && data.status === "success") {
        setAlarms(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching alarms:", error);
    }
  };

  const filterAndSortAlarms = () => {
    let filtered = [...alarms];

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(alarm => alarm.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        alarm =>
          alarm.title?.toLowerCase().includes(term) ||
          alarm.description?.toLowerCase().includes(term) ||
          alarm.source?.toLowerCase().includes(term)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      
      if (sortConfig.key === "timestamp") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredAlarms(filtered);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const handleAcknowledge = async (alarmId) => {
    setAcknowledging(true);
    try {
      const response = await fetch(`${API_BASE_URL}/alarms/${alarmId}/acknowledge`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acknowledged_by: userData.username })
      });
      const data = await response.json();
      if (response.ok && data.status === "success") {
        await fetchAlarms();
      }
    } catch (error) {
      console.error("Error acknowledging alarm:", error);
    } finally {
      setAcknowledging(false);
    }
  };

  const handleResolve = async (alarmId) => {
    setResolving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/alarms/${alarmId}/resolve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolved_by: userData.username })
      });
      const data = await response.json();
      if (response.ok && data.status === "success") {
        await fetchAlarms();
        setShowAlarmModal(false);
        setSelectedAlarm(null);
      }
    } catch (error) {
      console.error("Error resolving alarm:", error);
    } finally {
      setResolving(false);
    }
  };

  const handleViewAlarm = (alarm) => {
    setSelectedAlarm(alarm);
    setShowAlarmModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <span className="status-badge active-status">Active</span>;
      case "acknowledged":
        return <span className="status-badge acknowledged-status">Acknowledged</span>;
      case "resolved":
        return <span className="status-badge resolved-status">Resolved</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return <span className="severity-badge critical">Critical</span>;
      case "high":
        return <span className="severity-badge high">High</span>;
      case "medium":
        return <span className="severity-badge medium">Medium</span>;
      case "low":
        return <span className="severity-badge low">Low</span>;
      default:
        return <span className="severity-badge info">Info</span>;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setUserData(prev => ({ ...prev, photo: imageURL, photoFile: file }));
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
      if (userData.photoFile) formData.append("photo", userData.photoFile);

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
        setUserData(prev => ({
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
    setResetData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendOTP = async () => {
    try {
      setResetLoading(true);
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetData.email }),
      });
      const data = await response.json();
      if (response.ok) alert("OTP sent successfully to your email");
      else alert(data.detail || data.message || "Failed to send OTP");
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetData.email, otp: resetData.otp }),
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
        headers: { "Content-Type": "application/json" },
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
        setResetData({ email: "", otp: "", new_password: "", confirm_password: "" });
      } else {
        alert(data.detail || "Password reset failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setResetLoading(false);
    }
  };

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
            <div className="top-menu-item" onClick={() => handleNavigation("/dashboard")}>
              <FaChartLine />
              <span>Dashboard</span>
            </div>
            <div className="top-menu-item active" onClick={() => handleNavigation("/alarms")}>
              <FaBell />
              <span>Alarms</span>
            </div>
            <div className="top-menu-item" onClick={() => handleNavigation("/projects")}>
              <FaFolderOpen />
              <span>Projects</span>
            </div>
            <div className="top-menu-item" onClick={() => handleNavigation("/users")}>
              <FaUsers />
              <span>Users</span>
            </div>
            <div className="top-menu-item" onClick={() => handleNavigation("/reports")}>
              <FaFileAlt />
              <span>Reports</span>
            </div>
            <div className="top-menu-item" onClick={() => handleNavigation("/help")}>
              <FaQuestionCircle />
              <span>Help</span>
            </div>
          </div>
          <div className="mobile-menu-btn">
            <FaBars onClick={() => setShowMobileMenu(true)} />
          </div>
        </div>

        {/* Mobile Sidebar */}
        {showMobileMenu && (
          <div className="mobile-sidebar-overlay">
            <div className="mobile-sidebar">
              <div className="mobile-sidebar-header">
                <img src={logoImage} alt="Logo" className="mobile-logo" />
                <button className="close-mobile-btn" onClick={() => setShowMobileMenu(false)}>
                  ✕
                </button>
              </div>
              <div className="mobile-sidebar-menu">
                <div className="mobile-sidebar-item" onClick={() => handleNavigation("/dashboard")}>
                  <FaChartLine />
                  <span>Dashboard</span>
                </div>
                <div className="mobile-sidebar-item active" onClick={() => handleNavigation("/alarms")}>
                  <FaBell />
                  <span>Alarms</span>
                </div>
                <div className="mobile-sidebar-item" onClick={() => handleNavigation("/projects")}>
                  <FaFolderOpen />
                  <span>Projects</span>
                </div>
                <div className="mobile-sidebar-item" onClick={() => handleNavigation("/users")}>
                  <FaUsers />
                  <span>Users</span>
                </div>
                <div className="mobile-sidebar-item" onClick={() => handleNavigation("/reports")}>
                  <FaFileAlt />
                  <span>Reports</span>
                </div>
                <div className="mobile-sidebar-item" onClick={() => handleNavigation("/help")}>
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
              <div className="tracking-ip">
                <FaGlobe />
                <h5>Tracking IP</h5>
                <span>{liveIP?.location?.private_ip || liveIP?.ip || "Loading..."}</span>
              </div>

              <div className="notification-icon">
                <FaBell />
                <span className="notification-badge">3</span>
              </div>

              <div className="profile-wrapper">
                <div className="profile-section" onClick={() => setShowDropdown(!showDropdown)}>
                  <img src={userData.photo} alt="Profile" className="profile-image" />
                  <div className="profile-details">
                    <h4>{userData.name}</h4>
                    <p>{userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1).toLowerCase() : ""}</p>
                  </div>
                  <FaChevronDown />
                </div>

                {showDropdown && (
                  <div className="profile-dropdown">
                    <div className="dropdown-item" onClick={() => { setShowProfileModal(true); setShowDropdown(false); }}>
                      <FaUserCircle />
                      Profile
                    </div>
                    <div className="dropdown-item" onClick={() => { setShowResetPasswordModal(true); setShowDropdown(false); }}>
                      <FaEdit />
                      Reset Password
                    </div>
                    <div className="dropdown-item logout-item" onClick={() => { if (window.confirm("Are you sure you want to logout?")) handleLogout(); }}>
                      <FaSignOutAlt />
                      Logout
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="dashboard-content">
            <div className="alarms-container">
              <div className="alarms-header">
                <div className="alarms-title-section">
                  <h1>Alarms & Notifications</h1>
                  <p>Monitor and manage system alerts</p>
                </div>
                <div className="alarms-stats">
                  <div className="stat-card">
                    <div className="stat-icon active-icon"><FaExclamationTriangle /></div>
                    <div className="stat-info">
                      <span className="stat-value">{alarms.filter(a => a.status === "active").length}</span>
                      <span className="stat-label">Active</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon acknowledged-icon"><FaEye /></div>
                    <div className="stat-info">
                      <span className="stat-value">{alarms.filter(a => a.status === "acknowledged").length}</span>
                      <span className="stat-label">Acknowledged</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon resolved-icon"><FaCheckCircle /></div>
                    <div className="stat-info">
                      <span className="stat-value">{alarms.filter(a => a.status === "resolved").length}</span>
                      <span className="stat-label">Resolved</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="filters-section">
                <div className="search-wrapper">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search alarms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div className="filter-buttons">
                  <button className={`filter-btn ${filterStatus === "all" ? "active" : ""}`} onClick={() => setFilterStatus("all")}>
                    All
                  </button>
                  <button className={`filter-btn ${filterStatus === "active" ? "active" : ""}`} onClick={() => setFilterStatus("active")}>
                    Active
                  </button>
                  <button className={`filter-btn ${filterStatus === "acknowledged" ? "active" : ""}`} onClick={() => setFilterStatus("acknowledged")}>
                    Acknowledged
                  </button>
                  <button className={`filter-btn ${filterStatus === "resolved" ? "active" : ""}`} onClick={() => setFilterStatus("resolved")}>
                    Resolved
                  </button>
                </div>
              </div>

              <div className="alarms-table-wrapper">
                <table className="alarms-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort("severity")}>Severity {getSortIcon("severity")}</th>
                      <th onClick={() => handleSort("title")}>Title {getSortIcon("title")}</th>
                      <th>Description</th>
                      <th onClick={() => handleSort("source")}>Source {getSortIcon("source")}</th>
                      <th onClick={() => handleSort("timestamp")}>Time {getSortIcon("timestamp")}</th>
                      <th onClick={() => handleSort("status")}>Status {getSortIcon("status")}</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAlarms.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="no-data">No alarms found</td>
                      </tr>
                    ) : (
                      filteredAlarms.map((alarm) => (
                        <tr key={alarm.id} className={`alarm-row ${alarm.status}`}>
                          <td>{getSeverityBadge(alarm.severity)}</td>
                          <td className="alarm-title">{alarm.title}</td>
                          <td className="alarm-desc">{alarm.description?.substring(0, 60)}...</td>
                          <td>{alarm.source || "System"}</td>
                          <td>{new Date(alarm.timestamp).toLocaleString()}</td>
                          <td>{getStatusBadge(alarm.status)}</td>
                          <td className="actions-cell">
                            <button className="action-btn view-btn" onClick={() => handleViewAlarm(alarm)}>
                              <FaEye /> View
                            </button>
                            {alarm.status === "active" && (
                              <button className="action-btn acknowledge-btn" onClick={() => handleAcknowledge(alarm.id)} disabled={acknowledging}>
                                <FaEyeSlash /> Acknowledge
                              </button>
                            )}
                            {(alarm.status === "active" || alarm.status === "acknowledged") && (
                              <button className="action-btn resolve-btn" onClick={() => handleResolve(alarm.id)} disabled={resolving}>
                                <FaCheckCircle /> Resolve
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alarm Detail Modal */}
      {showAlarmModal && selectedAlarm && (
        <div className="modal-overlay">
          <div className="alarm-detail-modal">
            <div className="modal-header">
              <div>
                <h4>Alarm Details</h4>
                <p>Detailed information about this alarm</p>
              </div>
              <button className="close-btn" onClick={() => { setShowAlarmModal(false); setSelectedAlarm(null); }}>✕</button>
            </div>
            <div className="alarm-detail-content">
              <div className="detail-row">
                <span className="detail-label">Title:</span>
                <span className="detail-value">{selectedAlarm.title}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Description:</span>
                <span className="detail-value">{selectedAlarm.description}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Severity:</span>
                <span className="detail-value">{getSeverityBadge(selectedAlarm.severity)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className="detail-value">{getStatusBadge(selectedAlarm.status)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Source:</span>
                <span className="detail-value">{selectedAlarm.source || "System"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Timestamp:</span>
                <span className="detail-value">{new Date(selectedAlarm.timestamp).toLocaleString()}</span>
              </div>
              {selectedAlarm.acknowledged_by && (
                <div className="detail-row">
                  <span className="detail-label">Acknowledged By:</span>
                  <span className="detail-value">{selectedAlarm.acknowledged_by}</span>
                </div>
              )}
              {selectedAlarm.resolved_by && (
                <div className="detail-row">
                  <span className="detail-label">Resolved By:</span>
                  <span className="detail-value">{selectedAlarm.resolved_by}</span>
                </div>
              )}
              {selectedAlarm.resolved_at && (
                <div className="detail-row">
                  <span className="detail-label">Resolved At:</span>
                  <span className="detail-value">{new Date(selectedAlarm.resolved_at).toLocaleString()}</span>
                </div>
              )}
            </div>
            <div className="modal-actions">
              {selectedAlarm.status === "active" && (
                <button className="action-btn acknowledge-btn" onClick={() => handleAcknowledge(selectedAlarm.id)} disabled={acknowledging}>
                  <FaEyeSlash /> Acknowledge
                </button>
              )}
              {(selectedAlarm.status === "active" || selectedAlarm.status === "acknowledged") && (
                <button className="action-btn resolve-btn" onClick={() => handleResolve(selectedAlarm.id)} disabled={resolving}>
                  <FaCheckCircle /> Resolve
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="modal-overlay">
          <div className="reset-password-modal">
            <div className="modal-header">
              <div><h4>Reset Password</h4><p>Secure your account with a new password</p></div>
              <button className="close-btn" onClick={() => { setShowResetPasswordModal(false); setOtpVerified(false); }}>✕</button>
            </div>
            <div className="reset-form-container">
              <div className="form-group full-width">
                <label>Email Address</label>
                <input type="email" name="email" value={resetData.email} onChange={handleResetInputChange} placeholder="Enter your email" />
              </div>
              <button className="otp-btn" onClick={handleSendOTP} disabled={resetLoading}>{resetLoading ? "Sending..." : "Send OTP"}</button>
              <div className="form-group full-width">
                <label>Enter OTP</label>
                <input type="text" name="otp" value={resetData.otp} onChange={handleResetInputChange} placeholder="Enter OTP" />
              </div>
              <button className="verify-btn" onClick={handleVerifyOTP} disabled={resetLoading}>Verify OTP</button>
              {otpVerified && (
                <>
                  <div className="form-group full-width">
                    <label>New Password</label>
                    <input type="password" name="new_password" value={resetData.new_password} onChange={handleResetInputChange} placeholder="Enter new password" />
                  </div>
                  <div className="form-group full-width">
                    <label>Confirm Password</label>
                    <input type="password" name="confirm_password" value={resetData.confirm_password} onChange={handleResetInputChange} placeholder="Confirm password" />
                  </div>
                  <button className="save-btn" onClick={handleResetPassword}>Reset Password</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="profile-modal">
            <div className="modal-header">
              <div><h4>Edit Profile</h4><p>Update your profile details</p></div>
              <button className="close-btn" onClick={() => setShowProfileModal(false)}>✕</button>
            </div>
            <div className="profile-upload-section">
              <div className="profile-image-wrapper">
                <img src={userData.photo} alt="Profile" className="edit-profile-image" />
                <button className="camera-btn" onClick={() => fileInputRef.current.click()}><FaCamera /></button>
              </div>
              <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handlePhotoChange} />
            </div>
            <div className="profile-form">
              <div className="form-group"><label>Full Name</label><input type="text" name="name" value={userData.name} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Username</label><input type="text" name="username" value={userData.username} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Email</label><input type="email" name="email" value={userData.email} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Contact Number</label><input type="text" name="contact_no" value={userData.contact_no} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Role</label><input type="text" value={userData.role} disabled className="disabled-input" /></div>
              <button className="save-btn" onClick={handleProfileUpdate}><FaEdit /> Update Profile</button>
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

        html, body {
          width: 100%;
          overflow-x: hidden;
          background: #f5f7fb;
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
          100% { transform: rotate(360deg); }
        }

        .dashboard-wrapper {
          width: 100%;
          min-height: 100vh;
          background: #f5f7fb;
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
          z-index: 999;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
        }

        .top-navbar-left { display: flex; align-items: center; padding-left: 20px; }
        .top-logo { width: 135px; object-fit: contain; background: white; }
        .top-navbar-center { display: flex; align-items: center; gap: 14px; }
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
        .top-menu-item:hover, .top-menu-item.active { background: #b8d63c; color: #111827; }
        .mobile-menu-btn { display: none; color: white; font-size: 24px; cursor: pointer; padding-right: 20px; }
        .mobile-sidebar-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); z-index: 9999; }
        .mobile-sidebar { width: 290px; height: 100%; background: white; padding: 22px; overflow-y: auto; animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        .mobile-sidebar-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
        .mobile-logo { width: 120px; }
        .close-mobile-btn { width: 40px; height: 40px; border: none; background: #f3f4f6; border-radius: 12px; cursor: pointer; font-size: 18px; }
        .mobile-sidebar-menu { display: flex; flex-direction: column; gap: 10px; }
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
        .mobile-sidebar-item:hover, .mobile-sidebar-item.active { background: #b8d63c; }

        .dashboard-main { width: 100%; min-height: 100vh; margin-top: 78px; }
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
        .navbar-left { padding-left: 20px; }
        .navbar-right { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; padding-right: 20px; }
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
        .profile-wrapper { position: relative; }
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
        .profile-section:hover { background: #eef2ff; }
        .profile-image { width: 46px; height: 46px; border-radius: 50%; object-fit: cover; border: 2px solid #dbeafe; }
        .profile-details { display: flex; flex-direction: column; }
        .profile-details h4 { font-size: 14px; font-weight: 700; color: #111827; }
        .profile-details p { font-size: 11px; color: #6b7280; margin-top: 2px; text-transform: capitalize; }
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
        .dropdown-item:hover { background: #f8fafc; }
        .logout-item { color: red; }

        .dashboard-content {
          width: 100%;
          padding: 16px 20px;
        }

        .alarms-container {
          background: white;
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        .alarms-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 28px;
        }

        .alarms-title-section h1 {
          font-size: 28px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }
        .alarms-title-section p {
          font-size: 14px;
          color: #6b7280;
          margin-top: 6px;
        }

        .alarms-stats {
          display: flex;
          gap: 16px;
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          background: #f8fafc;
          border-radius: 16px;
        }
        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        .active-icon { background: #fee2e2; color: #ef4444; }
        .acknowledged-icon { background: #fef3c7; color: #f59e0b; }
        .resolved-icon { background: #dcfce7; color: #10b981; }
        .stat-info { display: flex; flex-direction: column; }
        .stat-value { font-size: 24px; font-weight: 800; color: #111827; }
        .stat-label { font-size: 12px; color: #6b7280; }

        .filters-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }
        .search-wrapper {
          position: relative;
          flex: 1;
          max-width: 320px;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }
        .search-input {
          width: 100%;
          height: 46px;
          padding: 0 16px 0 42px;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          font-size: 14px;
        }
        .search-input:focus { outline: none; border-color: #6d28d9; }
        .filter-buttons { display: flex; gap: 10px; flex-wrap: wrap; }
        .filter-btn {
          padding: 8px 20px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }
        .filter-btn:hover { border-color: #6d28d9; color: #6d28d9; }
        .filter-btn.active { background: #6d28d9; color: white; border-color: #6d28d9; }

        .alarms-table-wrapper {
          overflow-x: auto;
        }
        .alarms-table {
          width: 100%;
          border-collapse: collapse;
        }
        .alarms-table th {
          text-align: left;
          padding: 16px 12px;
          background: #f8fafc;
          font-size: 13px;
          font-weight: 700;
          color: #374151;
          cursor: pointer;
          user-select: none;
          border-bottom: 2px solid #e5e7eb;
        }
        .alarms-table th svg { margin-left: 6px; vertical-align: middle; }
        .alarms-table td {
          padding: 16px 12px;
          font-size: 13px;
          color: #374151;
          border-bottom: 1px solid #f0f0f0;
        }
        .alarm-row.active { background: #fff5f5; }
        .alarm-row.acknowledged { background: #fffbeb; }
        .alarm-row.resolved { background: #f0fdf4; }
        .alarm-title { font-weight: 600; color: #111827; }
        .alarm-desc { color: #6b7280; }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 30px;
          font-size: 11px;
          font-weight: 700;
        }
        .active-status { background: #fee2e2; color: #ef4444; }
        .acknowledged-status { background: #fef3c7; color: #f59e0b; }
        .resolved-status { background: #dcfce7; color: #10b981; }

        .severity-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
        }
        .severity-badge.critical { background: #7f1d1d; color: #fff; }
        .severity-badge.high { background: #dc2626; color: #fff; }
        .severity-badge.medium { background: #f59e0b; color: #fff; }
        .severity-badge.low { background: #10b981; color: #fff; }
        .severity-badge.info { background: #3b82f6; color: #fff; }

        .actions-cell {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border: none;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }
        .view-btn { background: #e5e7eb; color: #374151; }
        .view-btn:hover { background: #d1d5db; }
        .acknowledge-btn { background: #fef3c7; color: #d97706; }
        .acknowledge-btn:hover { background: #fde68a; }
        .resolve-btn { background: #dcfce7; color: #059669; }
        .resolve-btn:hover { background: #bbf7d0; }
        .action-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .no-data {
          text-align: center;
          padding: 48px;
          color: #9ca3af;
        }

        .alarm-detail-modal {
          width: 100%;
          max-width: 550px;
          background: white;
          border-radius: 24px;
          padding: 28px;
          max-height: 90vh;
          overflow-y: auto;
        }
        .alarm-detail-content {
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          padding: 12px 0;
          border-bottom: 1px solid #edf2f7;
        }
        .detail-label {
          width: 130px;
          font-weight: 700;
          color: #6b7280;
          font-size: 13px;
        }
        .detail-value {
          flex: 1;
          font-size: 14px;
          color: #111827;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #edf2f7;
        }

        /* Profile Modal */
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
        .modal-header h4 { font-size: 24px; font-weight: 800; color: #111827; }
        .modal-header p { font-size: 13px; color: #6b7280; margin-top: 5px; }
        .close-btn { width: 42px; height: 42px; border: none; background: #f3f4f6; border-radius: 12px; cursor: pointer; font-size: 18px; }
        .profile-upload-section { display: flex; justify-content: center; margin-bottom: 26px; }
        .profile-image-wrapper { position: relative; }
        .edit-profile-image { width: 140px; height: 140px; border-radius: 50%; object-fit: cover; border: 5px solid #eef2ff; }
        .camera-btn { position: absolute; right: 4px; bottom: 4px; width: 46px; height: 46px; border: none; border-radius: 50%; background: #6d28d9; color: white; cursor: pointer; font-size: 16px; }
        .profile-form { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .form-group { display: flex; flex-direction: column; }
        .form-group label { font-size: 13px; font-weight: 700; color: #111827; margin-bottom: 8px; }
        .form-group input { width: 100%; height: 52px; border: 1px solid #dbe2ea; border-radius: 16px; padding: 0 16px; font-size: 14px; }
        .form-group input:focus { outline: none; border-color: #6d28d9; }
        .disabled-input { background: #f3f4f6; cursor: not-allowed; }
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
        }
        .reset-form-container { display: flex; flex-direction: column; gap: 18px; }
        .full-width { width: 100%; }
        .otp-btn, .verify-btn {
          width: 45%;
          height: 52px;
          border: none;
          border-radius: 26px;
          background: #004a92;
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          margin: 0 auto;
        }
        .otp-btn:hover, .verify-btn:hover { background: #1171d2; }

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

        @media (max-width: 1200px) {
          .dashboard-content { padding: 16px; }
        }
        @media (max-width: 992px) {
          .top-navbar-center { display: none; }
          .mobile-menu-btn { display: flex; align-items: center; justify-content: center; }
          .alarms-stats { width: 100%; justify-content: space-between; }
        }
        @media (max-width: 768px) {
          .dashboard-navbar { flex-direction: column; align-items: flex-start; gap: 16px; }
          .navbar-right { width: 100%; justify-content: space-between; }
          .alarms-header { flex-direction: column; }
          .filters-section { flex-direction: column; align-items: stretch; }
          .search-wrapper { max-width: 100%; }
          .profile-form { grid-template-columns: 1fr; }
          .save-btn { grid-column: span 1; width: 100%; }
        }
        @media (max-width: 480px) {
          .dashboard-content { padding: 12px; }
          .alarms-container { padding: 16px; }
          .stat-card { padding: 8px 12px; }
          .stat-value { font-size: 18px; }
          .profile-details { display: none; }
          .actions-cell { flex-direction: column; }
          .action-btn { justify-content: center; }
        }
      `}</style>
    </>
  );
};

export default Alarms;