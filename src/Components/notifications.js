import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import API_URL from "../global";
const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  useEffect(() => {
    async function getData() {
      try {
        const userResponse = await axios.get(`${API_URL}/auth/user`);
        if (userResponse.data.userName) {
          setUserName(userResponse.data.userName);
          setUserId(userResponse.data.userId);
          const notificationsResponse = await axios.post(
            `${API_URL}/notifications`,
            { id: userResponse.data.userId }
          );
          setNotifications(notificationsResponse.data);
        } else {
          setUserName("Guest");
        }
      } catch (error) {
        console.error(error);
        setError("Error fetching notifications");
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, []);

  const formatNotificationTime = (timestamp) => {
    const now = moment();
    const notificationTime = moment(timestamp);
    const diff = now.diff(notificationTime, "minutes");

    if (diff < 1) {
      return "just now";
    } else if (diff < 60) {
      return `${diff} ${diff === 1 ? "minute" : "minutes"} ago`;
    } else {
      return notificationTime.fromNow();
    }
  };

  const handleNotificationClick = async (notificationId, threadId) => {
    try {
      const sendData = {
        id: userId,
      };
      const response = await axios.put(
        `${API_URL}/notifications/${notificationId}/read`,
        sendData
      );
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      if (response.data) navigate(`/threads/${threadId}`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (confirmDelete) {
      try {
        const sendData = {
          id: userId,
        };
        await axios.delete(`${API_URL}/notifications/${notificationId}`, {
          data: sendData,
        });
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification._id !== notificationId
          )
        );
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    }
  };

  return (
    <div>
      <h1>Notifications</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <>
          <p>
            hello <strong>{userName}</strong>,
          </p>
          <p>These are the notifications for you:</p>
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((notification) => (
                <li key={notification._id}>
                  <span
                    style={{
                      fontWeight: notification.isRead ? "normal" : "bold",
                    }}
                    onClick={() =>
                      handleNotificationClick(
                        notification._id,
                        notification.threadId
                      )
                    }
                  >
                    <img
                      src={notification.senderProfilePic}
                      alt={`user's ProfilePic`}
                      style={{
                        backgroundColor: "cyan",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        objectFit: "cover",
                      }}
                    />
                    <span
                      dangerouslySetInnerHTML={{ __html: notification.message }}
                    />
                    -{" "}
                  </span>

                  {formatNotificationTime(notification.createdAt)}
                  <button
                    onClick={() => handleDeleteNotification(notification._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>no notifications</p>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationsPage;
