import React, { useState, useEffect, useCallback } from "react";
import "./Home.css";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import moment from "moment";
import API_URL from "../global";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  XIcon,
  WhatsappShareButton,
  WhatsappIcon,
  RedditShareButton,
  RedditIcon,
  TelegramShareButton,
  TelegramIcon,
  EmailShareButton,
  EmailIcon,
} from "react-share";

const DetailedThread = () => {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [notification, setNotification] = useState(null);
  const [newComments, setNewComments] = useState({});
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userIdentity, setUserIdentity] = useState("");
  const [userProfilePic, setUserProfilePic] = useState("");
  const [selectedThread, setSelectedThread] = useState(null);
  const [commenterNames, setCommenterNames] = useState([]);
  const [likedThreads, setLikedThreads] = useState([]);
  const navigate = useNavigate();

  const fetchThread = useCallback(async () => {
    try {
      const response = await axios.post(`${API_URL}/threads/${threadId}`);
      setThread(response.data);
      setNewComments(response.data.comments);
      await axios.post(`${API_URL}/threads/${threadId}/views`);
    } catch (error) {
      console.error(error);
    }
  }, [threadId]);

  useEffect(() => {
    async function fetchData() {
      try {
        await fetchThread();
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [fetchThread, threadId]);

  useEffect(() => {
    async function getName() {
      try {
        const response = await axios.get(`${API_URL}/auth/user`);
        if (response.data.userName) {
          setUserName(response.data.userName);
          setUserId(response.data.userId);
          setIsAdmin(response.data.isAdmin);
          setUserProfilePic(response.data.profilePic);
          setUserIdentity(response.data.userIdentity);
        } else {
          setUserName("Guest");
        }
      } catch (error) {
        console.error(error);
      }
    }
    getName();
    const handleClickOutside = (event) => {
      const commentInput = document.getElementById("commentInput");

      if (commentInput && !commentInput.contains(event.target)) {
        setCommenterNames([]);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      // Remove the event listener when the component unmounts
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const toggleTotalCommentsVisibility = (threadId) => {
    setShowComments((prevShowComments) => ({
      ...prevShowComments,
      [threadId]: !prevShowComments[threadId],
    }));
  };
  const toggleCommentsVisibility = (threadId) => {
    setVisibleComments((prevState) => ({
      ...prevState,
      [threadId]: !prevState[threadId],
    }));
  };
  const isAuthor = () => {
    // Check if the current user is the author of the thread
    return userName === thread.author;
  };

  const showNotification = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  // const handleLike = async (threadId) => {
  //   try {
  //     const response = await axios.post(
  //       `${API_URL}/threads/${threadId}/like`,
  //       { userId: userId }
  //     );
  //     setThread(
  //       thread.map((thread) =>
  //         thread._id === threadId
  //           ? { ...thread, likes: response.data.likes }
  //           : thread
  //       )
  //     );

  //     if (likedThreads.includes(threadId)) {
  //       setLikedThreads(likedThreads.filter((id) => id !== threadId));
  //     } else {
  //       setLikedThreads([...likedThreads, threadId]);
  //     }
  //   } catch (error) {
  //     console.error("Error handling like:", error.response.data);
  //   }
  // };
  const handleLike = async (threadId) => {
    try {
      const response = await axios.post(`${API_URL}/threads/${threadId}/like`, {
        userId: userId,
      });

      if (response && response.data) {
        setThread((prevThread) => ({
          ...prevThread,
          likes: response.data.likes,
          likedBy: response.data.likedBy,
        }));

        if (likedThreads.includes(threadId)) {
          setLikedThreads(likedThreads.filter((id) => id !== threadId));
        } else {
          setLikedThreads([...likedThreads, threadId]);
        }
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      console.error(
        "Error handling like:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const handleDeleteThread = () => {
    const sendData = { isAdmin: isAdmin, userName: userName };

    // Confirm deletion with the user
    const confirmed = window.confirm(
      "Are you sure you want to delete this thread?"
    );

    if (!confirmed) {
      // User canceled the deletion
      return;
    }

    axios
      .delete(`${API_URL}/threads/${thread._id}`, { data: sendData })
      .then((response) => {
        // Assuming you have a function to redirect or handle deletion success
        handleDeletionSuccess(response.data);
      })
      .catch((error) => {
        console.error("Error deleting thread:", error);
        // Handle deletion error, show a notification, or redirect to an error page
      });
  };

  const handleEditThread = () => {
    // Navigate to the edit thread page with the thread ID
    navigate(`/edit-thread/${thread._id}`);
  };
  const closeShareModal = () => {
    setSelectedThread(null);
    setShareModalVisible(false);
  };
  const handleDeletionSuccess = () => {
    navigate(`/`);
  };

  const handleShare = (thread) => {
    if (selectedThread && selectedThread._id === thread._id) {
      // Clicking the share button again to hide the share modal
      closeShareModal();
    } else {
      // Clicking the share button to show the share modal
      setSelectedThread(thread);
      setShareModalVisible(true);
    }
  };
  const fetchCommenterNames = async (threadId) => {
    try {
      const response = await axios.get(
        `${API_URL}/threads/${threadId}/commenters`
      );
      // Extract commenter names from the response and update state
      setCommenterNames(response.data);
    } catch (error) {
      console.error("Error fetching commenter names:", error);
    }
  };
  const handleNameSelection = (selectedName) => {
    // Get the current comment text and thread ID
    const currentThreadId = Object.keys(newComments)[0];
    const currentCommentText = newComments[currentThreadId]?.text || "";

    // Find the index of "@" in the comment text
    const atIndex = currentCommentText.indexOf("@");

    // Extract the text before "@" and concatenate the selected name
    const updatedCommentText =
      currentCommentText.substring(0, atIndex) +
      "#" +
      selectedName +
      currentCommentText.substring(atIndex + selectedName.length + 1);

    // Update the newComments state with the modified comment text
    setNewComments((prevComments) => ({
      ...prevComments,
      [currentThreadId]: { text: updatedCommentText },
    }));

    // Clear the commenter names suggestions
    setCommenterNames([]);
  };
  const handleComment = (threadId) => {
    if (!userId) {
      // If not logged in, navigate to the login page
      showNotification("Login to comment");
      navigate("/login");
      return;
    }

    const commentText = newComments[threadId]?.text.trim();
    if (!commentText) {
      showNotification("Comment text cannot be empty.");
      return;
    }

    const commentData = {
      text: newComments[threadId]?.text.trim(),
      userId,
      mentionedUserIdentities: getMentionedUserIdentities(
        newComments[threadId]?.text
      ),
    };

    axios
      .post(`${API_URL}/threads/${threadId}/comments`, commentData)
      .then((response) => {
        // Update the state with the newly posted comment
        setThread(response.data);

        setVisibleComments((prevVisibleComments) => ({
          ...prevVisibleComments,
          [threadId]: true,
        }));
      })
      .catch((error) => console.error(error));

    // Clear the comment input and commenter names after submitting
    setNewComments((prevComments) => ({
      ...prevComments,
      [threadId]: { text: "" },
    }));
    setCommenterNames([]);
  };

  const getMentionedUserIdentities = (text) => {
    const mentions = text.match(/#([a-zA-Z0-9_]+)/g) || [];
    return mentions.map((mention) => mention.slice(1)); // remove "@" symbol
  };
  const renderThreadTitle = (thread) => {
    return (
      <>
        <Link to={`/threads/${thread._id}`}>
          <h3>{thread.highlightedTitle || thread.title}</h3>
        </Link>
        <h6>
          by
          <img
            src={thread.authorProfilePic}
            alt={`${thread.author}'s ProfilePic`}
            style={{
              backgroundColor: "cyan",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
            }}
          />{" "}
          <u>{thread.author}</u> <u>@{thread.authorIdentity}</u>
          {thread.authorIsAdmin && <>♛</>}- {moment(thread.createdAt).fromNow()}
        </h6>
        <br />
        <br />#{thread.heading}_forum
        <br />
      </>
    );
  };
  const handleDeleteComment = async (threadId, commentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmDelete) {
      // If the user cancels the delete operation, do nothing
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/threads/${threadId}/comments/${commentId}`,
        { isAdmin: isAdmin }
      );

      // After successful deletion, update the comments in state
      setThread((prevThread) => ({
        ...prevThread,
        comments: prevThread.comments.filter(
          (comment) => comment._id !== commentId
        ),
      }));

      showNotification("Comment deleted successfully.");
    } catch (error) {
      console.error("Error deleting comment:", error);
      showNotification("Failed to delete comment. Please try again.");
    }
  };

  if (!thread) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      <h1>Revnitro Forum - Single Thread</h1>
      <div className="currentUser">
        <div
          className="currentUserProfilePic"
          style={{
            backgroundColor: "cyan",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            objectFit: "cover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={userProfilePic}
            alt={`${userName}'s ProfilePic`}
            style={{
              backgroundColor: "cyan",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              objectFit: "cover",
            }}
          />
        </div>
        <p>hello..{userName}!</p>
        {userId && <p>@ {userIdentity}</p>}
        <a href="/updateProfile">
          <button>Update Profile</button>
        </a>
      </div>

      <div className="threads-container">
        <div className="thread">
          {renderThreadTitle(thread)}

          {(isAuthor() || isAdmin) && (
            <button onClick={handleDeleteThread}>Delete Thread</button>
          )}
          {isAuthor() && (
            <button onClick={handleEditThread}>Edit Thread</button>
          )}
          <br />
          {/* {renderThreadContent(thread)} */}
          {thread.thumbnail && (
            <img
              src={thread.thumbnail}
              alt={`${thread.title}'s thumbnail`}
              style={{
                backgroundColor: "cyan",
                width: 400,
                height: 300,
              }}
            />
          )}
          <br />
          <br />
          <div dangerouslySetInnerHTML={{ __html: thread.content }} />
          <button onClick={() => handleLike(thread._id)}>
            {thread.likedBy.includes(userId) ? "Unlike" : "Like"} (
            {thread.likes})
          </button>
          <button
            onClick={() => {
              handleShare(thread);
              if (!toggleTotalCommentsVisibility(thread._id)) {
                toggleTotalCommentsVisibility(thread._id);
              }
            }}
          >
            Share
          </button>
          <button
            onClick={() => {
              closeShareModal();
              toggleTotalCommentsVisibility(thread._id);
            }}
          >
            {showComments[thread._id] ? "Hide Comments" : "Show Comments"}
          </button>
          {selectedThread && selectedThread._id === thread._id && (
            <div
              className={`share-modal ${shareModalVisible ? "visible" : ""}`}
            >
              <h3>Share '{selectedThread.title}'</h3>

              <FacebookShareButton
                url={`${window.location.origin}/threads/${thread._id}`}
              >
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton
                url={`${window.location.origin}/threads/${thread._id}`}
                title={thread.title}
              >
                <XIcon size={32} round />
              </TwitterShareButton>

              <WhatsappShareButton
                url={`${window.location.origin}/threads/${thread._id}`}
                title={thread.title}
              >
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>

              <RedditShareButton
                url={`${window.location.origin}/threads/${thread._id}`}
                title={thread.title}
              >
                <RedditIcon size={32} round />
              </RedditShareButton>

              <TelegramShareButton
                url={`${window.location.origin}/threads/${thread._id}`}
                title={thread.title}
              >
                <TelegramIcon size={32} round />
              </TelegramShareButton>

              <EmailShareButton
                url={`${window.location.origin}/threads/${thread._id}`}
                subject={thread.title}
                body={`Check out this thread:\n${window.location.origin}/threads/${thread._id}`}
              >
                <EmailIcon size={32} round />
              </EmailShareButton>
            </div>
          )}

          {/* <ul>
            {thread.comments.map((comment) => (
              <li key={comment._id}>
                <u>{comment.userName}</u>: &nbsp;&nbsp;{comment.text}
                <span className="comment-time">
                  {moment(comment.createdAt).fromNow()}
                </span>
              </li>
            ))}
          </ul> */}
          {showComments[thread._id] && (
            <>
              <ul>
                {thread.comments
                  .slice(0, visibleComments[thread._id] ? undefined : 2)
                  .map((comment) => (
                    <li key={comment._id}>
                      <img
                        src={comment.commenterProfilePic}
                        alt={`${comment.commenterName}'s ProfilePic`}
                        style={{
                          backgroundColor: "cyan",
                          borderRadius: "50%",
                          width: "30px",
                          height: "30px",
                          objectFit: "cover",
                        }}
                      />
                      &emsp;&emsp;
                      <u>{comment.commenterName}</u>: &nbsp;&nbsp;
                      <u>@{comment.commenterIdentity}</u>
                      {comment.commenterIsAdmin && <>♛</>}: &nbsp;&nbsp;
                      {comment.text}
                      <span className="comment-time">
                        {moment(comment.createdAt).fromNow()}
                      </span>
                      <br />
                      <br />
                      {(comment.commenterIdentity === userIdentity ||
                        isAdmin) && (
                        <button
                          onClick={() =>
                            handleDeleteComment(thread._id, comment._id)
                          }
                        >
                          Delete Comment
                        </button>
                      )}
                    </li>
                  ))}
              </ul>
              {thread.comments.length > 2 && (
                <div className="comment-buttons">
                  {visibleComments[thread._id] ? (
                    <button
                      onClick={() => toggleCommentsVisibility(thread._id)}
                    >
                      Show Less
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleCommentsVisibility(thread._id)}
                    >
                      Show More
                    </button>
                  )}
                </div>
              )}
              <div className="comment-container">
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={newComments[thread._id]?.text || ""}
                  onChange={(e) => {
                    setNewComments((prevComments) => ({
                      ...prevComments,
                      [thread._id]: { text: e.target.value },
                    }));

                    // Check if "@" is typed and trigger fetching of commenter names
                    if (e.target.value.includes("@")) {
                      fetchCommenterNames(thread._id);
                    }
                  }}
                />
                {commenterNames.length > 0 && (
                  <ul>
                    {commenterNames.map((name) => (
                      <li key={name} onClick={() => handleNameSelection(name)}>
                        {name}
                      </li>
                    ))}
                  </ul>
                )}
                <button onClick={() => handleComment(thread._id)}>
                  Submit Comment
                </button>
              </div>
            </>
          )}

          <div
            className={`notification-container ${notification ? "show" : ""}`}
          >
            {notification}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedThread;
