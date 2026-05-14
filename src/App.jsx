import React from "react";
import { BrowserRouter as Router, Routes, Route,} from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import ForgotPassword from "./Components/ForgotPassword";
import VerifyPassword from "./Components/VerifyPassword";
import SetPassword from "./Components/SetPassword";
import Dashboard from "./Components/Dashboard";
import Alarms from "./Pages/Alarms";
function App() {

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/forgot-password" element={<ForgotPassword />}/>
          <Route path="/verify-password" element={<VerifyPassword />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/alarms" element={<Alarms />}/>
        </Routes>
      </div>
    </Router>
  );
}
export default App;