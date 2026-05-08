import React from "react";
import {
  FaUsers,
  FaClipboardList,
  FaCheckCircle,
  FaTasks,
} from "react-icons/fa";

const Dashboard = () => {
  return (
    <>
      <div className="dashboard-container">

        <div className="dashboard-header">

          <div>
            <h1 className="dashboard-title">
              WELCOME TO
            </h1>

            <h2 className="dashboard-company">
              VENWIND REFEX POWER LTD
            </h2>

            <p className="dashboard-subtitle">
              Empowering Innovation Through
              Technology & Excellence
            </p>
          </div>

          <div className="dashboard-image-section">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Dashboard"
              className="dashboard-image"
            />
          </div>
        </div>
        <div className="dashboard-cards">

          <div className="dashboard-card">
            <FaUsers className="dashboard-icon" />

            <h3>Total Employees</h3>

            <h2>150+</h2>

            <p>
              Active employees working
              efficiently across projects.
            </p>
          </div>

          <div className="dashboard-card">
            <FaClipboardList className="dashboard-icon" />

            <h3>Total Projects</h3>

            <h2>45</h2>

            <p>
              Successfully managed and
              delivered multiple projects.
            </p>
          </div>

          <div className="dashboard-card">
            <FaCheckCircle className="dashboard-icon" />

            <h3>Completed Tasks</h3>

            <h2>320</h2>

            <p>
              Tasks completed with high
              productivity and quality.
            </p>
          </div>

          <div className="dashboard-card">
            <FaTasks className="dashboard-icon" />

            <h3>Pending Tasks</h3>

            <h2>18</h2>

            <p>
              Tasks currently in progress
              and under review.
            </p>
          </div>

        </div>

        <div className="dashboard-bottom">

          <div className="dashboard-about">

            <h3>About Company</h3>

            <p>
              VENWIND REFEX POWER LTD is
              dedicated to delivering
              innovative engineering and
              technology solutions with
              excellence, reliability, and
              customer satisfaction.
            </p>

          </div>

          <div className="dashboard-announcement">

            <h3>Latest Announcements</h3>

            <ul>
              <li>
                Employee meeting scheduled
                on Monday at 10 AM.
              </li>

              <li>
                New project onboarding
                starts next week.
              </li>

              <li>
                Monthly performance review
                updated successfully.
              </li>
            </ul>

          </div>

        </div>

      </div>

      <style>{`

      *{
        margin:0;
        padding:0;
        box-sizing:border-box;
        font-family:'Poppins',sans-serif;
      }

      body{
        background:#f4f7fc;
      }

      .dashboard-container{
        width:100%;
        min-height:100vh;
        padding:30px;
        background:#f4f7fc;
      }

      /* Header */

      .dashboard-header{
        width:100%;
        background:linear-gradient(
          135deg,
          #004a92,
          #1171d2
        );
        border-radius:20px;
        padding:40px;
        color:white;
        display:flex;
        justify-content:space-between;
        align-items:center;
        flex-wrap:wrap;
        margin-bottom:35px;
      }

      .dashboard-title{
        font-size:32px;
        font-weight:600;
        margin-bottom:10px;
      }

      .dashboard-company{
        font-size:42px;
        font-weight:700;
        margin-bottom:15px;
      }

      .dashboard-subtitle{
        font-size:16px;
        line-height:28px;
        max-width:500px;
      }

      .dashboard-image{
        width:220px;
        height:220px;
        object-fit:contain;
      }

      /* Cards */

      .dashboard-cards{
        width:100%;
        display:grid;
        grid-template-columns:
          repeat(auto-fit,minmax(240px,1fr));
        gap:25px;
        margin-bottom:35px;
      }

      .dashboard-card{
        background:white;
        padding:25px;
        border-radius:18px;
        box-shadow:
          0 4px 15px rgba(0,0,0,0.08);
        transition:0.3s ease;
      }

      .dashboard-card:hover{
        transform:translateY(-5px);
      }

      .dashboard-icon{
        font-size:45px;
        color:#004a92;
        margin-bottom:18px;
      }

      .dashboard-card h3{
        font-size:20px;
        color:#333;
        margin-bottom:10px;
      }

      .dashboard-card h2{
        font-size:34px;
        color:#004a92;
        margin-bottom:10px;
      }

      .dashboard-card p{
        font-size:14px;
        color:#666;
        line-height:24px;
      }

      .dashboard-bottom{
        display:grid;
        grid-template-columns:
          repeat(auto-fit,minmax(320px,1fr));
        gap:25px;
      }

      .dashboard-about,
      .dashboard-announcement{
        background:white;
        padding:25px;
        border-radius:18px;
        box-shadow:
          0 4px 15px rgba(0,0,0,0.08);
      }

      .dashboard-about h3,
      .dashboard-announcement h3{
        font-size:24px;
        color:#004a92;
        margin-bottom:15px;
      }

      .dashboard-about p{
        font-size:15px;
        line-height:28px;
        color:#555;
      }

      .dashboard-announcement ul{
        padding-left:20px;
      }

      .dashboard-announcement li{
        margin-bottom:15px;
        color:#555;
        line-height:24px;
      }

      @media screen and (max-width:768px){

        .dashboard-header{
          padding:25px;
          text-align:center;
          justify-content:center;
        }

        .dashboard-company{
          font-size:28px;
        }

        .dashboard-title{
          font-size:24px;
        }

        .dashboard-image{
          width:170px;
          height:170px;
          margin-top:20px;
        }

      }

      @media screen and (max-width:480px){

        .dashboard-container{
          padding:15px;
        }

        .dashboard-header{
          padding:20px;
        }

        .dashboard-company{
          font-size:22px;
        }

        .dashboard-title{
          font-size:20px;
        }

        .dashboard-subtitle{
          font-size:14px;
          line-height:24px;
        }

        .dashboard-card{
          padding:20px;
        }

        .dashboard-card h2{
          font-size:28px;
        }

        .dashboard-card h3{
          font-size:18px;
        }

      }

      `}</style>
    </>
  );
};

export default Dashboard;