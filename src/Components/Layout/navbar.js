import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/authcontext";
import LogoutButton from "../auth/Logout";
const Navbar = () => {
  const { loggedIn } = useContext(AuthContext);
  return (
    <div>
      <Link to="/">home</Link>
      {loggedIn === false && (
        <>
          &nbsp;&nbsp;
          <Link to="/register">Register</Link>
          &nbsp;&nbsp;
          <Link to="/login">Login</Link>
        </>
      )}
      &nbsp;&nbsp;
      {loggedIn === true && (
        <>
          <Link to="/CreateThread">Create Thread</Link>
          &nbsp;&nbsp;
          <LogoutButton />
        </>
      )}
    </div>
  );
};

export default Navbar;
