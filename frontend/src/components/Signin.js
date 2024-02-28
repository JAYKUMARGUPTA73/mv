import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const Signin = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const navigate = useNavigate();

  const handler = async () => {
    try {
      const user = await handleLogin(email, password,setToken);
      // console.log(user)

      if (user && user.role === "user") {
        // Redirect to the home page for regular users
        navigate("/");
        setTimeout(function() {
          window.location.href = window.location.href;
      }, 100);
      } else if (user && user.role === "admin") {
        // Redirect to the admin page for admin users
        navigate("/");
        setTimeout(function() {
          window.location.href = window.location.href;
      }, 100);
      } else {
        // Handle unexpected user data or role
        console.error("Unexpected user data or role");
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login failure if needed
    }
  };

  return (
    <div className="App">
      
      <div className="login-container">
        <h2>Login</h2>
        <form>
          <label>
            Email:
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <button type="button" onClick={handler}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
