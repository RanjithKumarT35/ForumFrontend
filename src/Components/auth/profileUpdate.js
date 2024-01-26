import React, { useEffect, useContext, useState } from "react";
import AuthContext from "../../context/authcontext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../global";
function UpdateProfile() {
  const [newUserName, setNewUserName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [email, setEmail] = useState("");
  const [newUserIdentity, setNewUserIdentity] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [newProfilePic, setNewProfilePic] = useState("");
  const [identityAvailable, setIdentityAvailable] = useState(false);
  const [userId, setUserId] = useState("");
  const { getLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    async function getName() {
      try {
        const response = await axios.get(`${API_URL}/auth/user`);
        if (response.data.userName) {
          setNewUserName(response.data.userName);
          setNewLastName(response.data.lastName);
          setEmail(response.data.email);
          setUserId(response.data.userId);
          setNewProfilePic(response.data.profilePic);
          setNewUserIdentity(response.data.userIdentity);
        } else {
          setNewUserName("Guest");
        }
      } catch (error) {
        console.error(error);
      }
    }
    getName();
  }, []);
  const handleProfilePicUpload = async (file) => {
    if (!file) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("sampleFile", file);

    try {
      // Upload the image
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update the user's profile picture URL
      const newProfilePic = response.data.link;
      setNewProfilePic(newProfilePic);
      alert("Profile Picture Uploaded successfully!");
      //   // Update the profile picture in the backend
      //   const sendData = {
      //     profilePic: newProfilePic,
      //     userId: userId,
      //   };

      //   await axios.put("${API_URL}/auth/updateProfile", sendData);

      //   // Display a success message
      //   alert("Profile Picture Uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Profile Picture Upload Failed. Please try again.");
    }
  };
  async function findIdentity(newUserIdentity) {
    const sendData = { userIdentity: newUserIdentity };
    const response = await axios.post(`${API_URL}/auth/findIdentity`, sendData);

    if (response.data === true) {
      setIdentityAvailable(true);
    } else if (response.data === false) {
      setIdentityAvailable(false);
    } else {
      setIdentityAvailable(false);
    }
  }
  const handlePasswordReset = async () => {
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
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const updateData = {
        newProfilePic,
        newUserName,
        newLastName,
        newUserIdentity,
        userId,
      };
      const response = await axios.put(
        `${API_URL}/auth/updateProfile`,
        updateData
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
      <h1>Update Your Profile</h1>

      <form onSubmit={handleSubmit}>
        <img
          src={newProfilePic}
          alt={`${newUserName}'s ProfilePic`}
          style={{
            backgroundColor: "cyan",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            objectFit: "cover",
          }}
        />
        <br />
        <input
          className="profilePicUpload"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setSelectedFile(file);
            handleProfilePicUpload(file); // Pass the file directly, not selectedFile
          }}
        />
        <br />
        <label htmlFor="html">New User Name :</label>
        <input
          type="text"
          name="newUserName"
          value={newUserName}
          placeholder="New User Name"
          onChange={(e) => setNewUserName(e.target.value)}
          required
        />
        <br></br>
        <br></br>
        <label htmlFor="html">Last Name :</label>
        <input
          type="text"
          name="newLastName"
          value={newLastName}
          placeholder="New Last Name"
          onChange={(e) => setNewLastName(e.target.value)}
          required
        />
        <br></br>
        <br></br>
        <label htmlFor="html">User ID :</label>
        <input
          type="text"
          name="text"
          value={newUserIdentity}
          placeholder="User ID"
          onChange={(e) => {
            const newValue = e.target.value;
            setNewUserIdentity(newValue);
            findIdentity(newValue);
          }}
          required
        />
        {identityAvailable && `UserID is taken`}
        <br></br>
        <br></br>

        <br></br>
        <button type="submit">Update Profile</button>
      </form>
      <span onClick={handlePasswordReset}>Reset Password</span>
    </div>
  );
}
export default UpdateProfile;
