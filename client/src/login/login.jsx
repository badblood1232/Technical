import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ Add this

function Login() {
  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ Hook for navigation

  const handleClick = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!data.email || !data.password) {
      setMessage("Please enter both email and password.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/api/login", data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/trips"), 1000); // ✅ Redirect after 1 sec
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setMessage(msg);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form>
        <label>Email</label><br />
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        /><br />

        <label>Password</label><br />
        <input
          type="password"
          name="password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        /><br /><br />

        <button type="submit" onClick={handleClick}>Login</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
