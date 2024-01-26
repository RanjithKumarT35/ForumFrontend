import React, { useContext, useState } from "react";
import axios from "axios";
import AuthContext from "../../context/authcontext";
import { useNavigate } from "react-router-dom";
import API_URL from "../global";
function ForgotPassword() {
  const { getLoggedIn } = useContext(AuthContext);
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const logoutAndNavigate = async () => {
    try {
      await axios.get(`${API_URL}/auth/logout`);
      await getLoggedIn();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout and navigation:", error);
      // Handle errors if needed
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      const sendData = {
        newPassword: newPassword,
        confirmPassword: confirmPassword,
        OTP: otp,
      };

      const response = await axios.post(
        `${API_URL}/auth/passwordChange`,
        sendData
      );

      if (response.data === "success") {
        alert("Password Changed Successfully. Please Login to Continue");
        logoutAndNavigate();
      } else {
        // Handle other response scenarios
        alert(response.data);
      }
    } catch (error) {
      console.error("Error during password change:", error);
      // Handle errors if needed
    }
  };

  return (
    <div>
      <h1>Change Password</h1>
      <form onSubmit={handlePasswordChange}>
        <label htmlFor="otp">OTP:</label>
        <input
          type="number"
          name="otp"
          value={otp}
          placeholder="Enter The OTP"
          onChange={(e) => setOTP(Number(e.target.value))}
          required
        />
        <br />
        <br />
        <label htmlFor="newPassword">New Password:</label>
        <input
          type="password"
          name="newPassword"
          value={newPassword}
          placeholder="New Password"
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <br />
        <label htmlFor="confirmPassword">Confirm New Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          placeholder="Confirm New Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
