import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import ForgotPassword from './Components/ForgotPassword';
import VerifyPassword from './Components/VerifyPassword'; 
import SetPassword from './Components/SetPassword';
import Dashboard from './Components/Dashboard';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-password" element={<VerifyPassword />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;