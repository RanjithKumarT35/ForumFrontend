import React, { useContext, useState } from "react";
import AuthContext from "../../context/authcontext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../global";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { getLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const loginData = { email, password };
      await axios.post(`${API_URL}/auth/login`, loginData);
      await getLoggedIn();
      navigate("/");
    } catch (err) {
      alert("Enter Proper Login Details");
    }
  }
  const handleForgotPassword = async () => {
    const response = await axios.post(`${API_URL}/auth/forgotPassword`, {
      email: email,
    });
    if (response.data === "success") {
      alert("Check your Email for Reset Password One-Time-Password");
      navigate("/forgotPassword");
    } else if (response.data === "processFailed") {
      alert("There is some Problem sending you mail");
    }
  };
  return (
    <div>
      <h1>Login to account</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="html">Email:</label>
        <input
          type="email"
          name="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <br />
        <label htmlFor="html">Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Login</button>
        <button type="button" onClick={handleForgotPassword}>
          ForgetPassword
        </button>
      </form>
    </div>
  );
}

export default Login;
