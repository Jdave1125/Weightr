import React, { useState } from "react";
import "/home/jdave1125/Weightr/src/Login.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Implement the logic to send a login request to your server
    const loginData = { username, password };

    try {
      // Send a POST request to your server for login
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        // If login is successful, call the onLogin callback
        // This callback can handle redirection to the main page
        onLogin();
      } else {
        // Handle login failure, e.g., display an error message
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
<div className="login-page">
    <div className="header-Container">
        <h1>Weightr</h1>
        <h3>Tracking made easy.</h3>
    </div>
  <div className="login-container">
    <h2>who you is?</h2>
    <form>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="button" onClick={handleLogin}>
        Login
      </button>
    </form>
  </div>
</div>
  );
}

export default Login;
