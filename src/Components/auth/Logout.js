import axios from "axios";
import React, { useContext } from "react";
import AuthContext from "../../context/authcontext";
import { useNavigate } from "react-router-dom";
import API_URL from "../global";
function LogoutButton() {
  const { getLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  async function logout() {
    await axios.get(`${API_URL}/auth/logout`);
    await getLoggedIn();
    navigate("/login");
  }
  return <button onClick={logout}>Logout</button>;
}
export default LogoutButton;
