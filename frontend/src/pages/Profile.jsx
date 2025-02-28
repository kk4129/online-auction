import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [newUsername, setNewUsername] = useState("");

  // Get JWT token from localStorage
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${authToken}` }, // ✅ Include token
        });
        setUser(response.data);
        setNewUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    

    if (authToken) {
      fetchUser();
    }
  }, [authToken]);

  const updateUsername = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/users/update",
        { username: newUsername },
        {
          headers: { Authorization: `Bearer ${authToken}` }, // ✅ Include token
        }
      );
      setUser((prev) => ({ ...prev, username: newUsername }));
      alert("Username updated!");
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      {user ? (
        <>
          <p><strong>Email:</strong> {user.email}</p>
          <div>
            <label>Username:</label>
            <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
            <button onClick={updateUsername}>Update Username</button>
          </div>

          
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
