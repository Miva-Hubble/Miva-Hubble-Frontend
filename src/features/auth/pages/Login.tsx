import React, { useState } from "react";
import "./auth.css";

import bigImg from "../../../assets/images/auth/ImageLarge.png";
import leftImg from "../../../assets/images/auth/imageleft.png";
import bottomImg from "../../../assets/images/auth/imageright.png";

import logo from "../../../assets/images/logo/logo and name.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="auth-container">

      {/* LEFT */}
      <div className="auth-left">

        {/* LOGO */}
        <div className="auth-logo">
          <img src={logo} alt="Miva Hubble Logo" />
          <span>UniConnect</span>
        </div>

        <div className="auth-title">
          <h1>Let's get started!</h1>
          <p>
            Join thousands of Miva students collaborating and succeeding together.
          </p>
        </div>

        <div className="auth-images">
          <img src={bigImg} alt="Students" />
          <img src={leftImg} alt="Library" />
          <img src={bottomImg} alt="Group" />
        </div>

      </div>


      {/* RIGHT */}
      <div className="auth-right">

        <div className="auth-form">

          <h2>Welcome back</h2>
          <p>Sign in to continue your academic journey</p>

          <input
            type="email"
            placeholder="student@miva.university"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="auth-btn">
            Sign in
          </button>

          <div className="auth-divider">or</div>

          <button className="google-btn">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              width="18"
            />
            Continue with Google
          </button>

          <div className="auth-link">
            Don't have an account? <span>Sign up</span>
          </div>

          <div className="verified-box">
            ✔ Verified Students Only <br />
            Email verification within 60 seconds
          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;
