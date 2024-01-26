import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import API_URL from "../global";
const AuthContext = createContext();

function AuthContextProvider(props) {
  const [loggedIn, setLoggedIn] = useState(undefined);
  async function getLoggedIn() {
    const loggedInRes = await axios.get(`${API_URL}/auth/loggedIn`);
    setLoggedIn(loggedInRes.data);
  }
  useEffect(() => {
    getLoggedIn();
  }, []);
  return (
    <AuthContext.Provider value={{ loggedIn, getLoggedIn }}>
      {props.children}
    </AuthContext.Provider>
  );
}
export { AuthContextProvider };
export default AuthContext;
