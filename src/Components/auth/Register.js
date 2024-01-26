import React, { useContext, useState } from "react";
import AuthContext from "../../context/authcontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../global";
function Register() {
  const [userName, setUserName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userIdentity, setUserIdentity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const [identityAvailable, setIdentityAvailable] = useState(false);
  const { getLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  async function findIdentity(userIdentity) {
    const sendData = { userIdentity: userIdentity };
    const response = await axios.post(`${API_URL}/auth/findIdentity`, sendData);
    console.log(response.data);

    if (response.data === true) {
      setIdentityAvailable(true);
    } else if (response.data === false) {
      setIdentityAvailable(false);
    } else {
      setIdentityAvailable(false);
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const registerData = {
        userName,
        lastName,
        email,
        password,
        passwordVerify,
        userIdentity,
      };
      const response = await axios.post(
        `${API_URL}/auth/register`,
        registerData
      );
      if (response.data === "please enter a password of atleast 6 charecters") {
        alert("please enter a password of atleast 6 charecters");
      } else if (response.data === "password doesnt match") {
        alert("password doesnt match");
      } else if (response.data === "UserName Already Exists") {
        alert("UserName Already Exists");
      } else if (response.data === "User Already Exists") {
        alert("User Already Exists");
      } else {
        await getLoggedIn();
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div>
      <h1>Register a new account</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="html">User Name :</label>
        <input
          type="text"
          name="userName"
          value={userName}
          placeholder="User Name"
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <br></br>
        <br></br>
        <label htmlFor="html">Last Name :</label>
        <input
          type="text"
          name="lastName"
          value={lastName}
          placeholder="Last Name"
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <br></br>
        <br></br>
        <label htmlFor="html">User ID :</label>
        <input
          type="text"
          name="text"
          value={userIdentity}
          placeholder="User ID"
          onChange={(e) => {
            const newValue = e.target.value;
            setUserIdentity(newValue);
            findIdentity(newValue);
          }}
          required
        />
        {identityAvailable && `UserID is taken`}
        <br></br>
        <br></br>
        <label htmlFor="html">Email :</label>
        <input
          type="email"
          name="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br></br>
        <br></br>
        <label htmlFor="html">Password :</label>
        <input
          type="password"
          name="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br></br>
        <br></br>
        <label htmlFor="html">Password Verify :</label>
        <input
          type="password"
          name="passwordVerify"
          value={passwordVerify}
          placeholder="Pasword Verify"
          onChange={(e) => setPasswordVerify(e.target.value)}
          required
        />
        <br></br>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
export default Register;
