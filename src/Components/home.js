import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Home.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import API_URL from "../global";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
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
function Home() {
  const { heading } = useParams();
  const [threads, setThreads] = useState([]);
  //const [currentPage, setCurrentPage] = useState(1);
  const [visibleComments, setVisibleComments] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [newComments, setNewComments] = useState({});
  const [showComments, setShowComments] = useState({});
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [userIdentity, setUserIdentity] = useState("");
  const [userProfilePic, setUserProfilePic] = useState("");
  //const [selectedFile, setSelectedFile] = useState(null);
  const [likedThreads, setLikedThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [commenterNames, setCommenterNames] = useState({});
  //const [userThreads] = useState("");
  const [selectedHeading, setSelectedHeading] = useState(heading || "All");
  //const [userNotifications, setUserNotifications] = useState([]);
  const [unreadUserNotifications, setUnreadUserNotifications] = useState();
  const Navigate = useNavigate();

  const fetchThreads = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/threads?&sort=${sortOption}&search=${currentSearchTerm}&heading=${selectedHeading}`
      );
      setThreads(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [sortOption, currentSearchTerm, selectedHeading]);
  const getName = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/user`);
      if (response.data.userName) {
        setUserName(response.data.userName);
        setUserId(response.data.userId);
        setUserProfilePic(response.data.profilePic);
        setIsAdmin(response.data.isAdmin);
        setUserIdentity(response.data.userIdentity);
        setUnreadUserNotifications(response.data.unreadNotifications);
      } else {
        setUserName("Guest");
      }
    } catch (error) {
      console.error(error);
    }
  }, []);
  useEffect(() => {
    if (heading) {
      setSelectedHeading(heading);
    } else {
      setSelectedHeading("All");
    }
  }, [heading]);
  useEffect(() => {
    // if (heading) {
    //   //console.log(heading);
    //   setSelectedHeading(heading);
    // } else {
    //   setSelectedHeading("All");
    // }
    async function fetchData() {
      try {
        await fetchThreads();
      } catch (error) {
        console.error("Error fetching headings:", error);
      }
    }

    fetchData();
    getName();
  }, [
    sortOption,
    heading,
    currentSearchTerm,
    selectedHeading,
    fetchThreads,
    getName,
  ]);

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
  const handleHeadingChange = (e) => {
    const selectedHeading = e.target.value;
    setSelectedHeading((prevHeading) => {
      if (prevHeading !== selectedHeading) {
        //setCurrentPage(1);
        return selectedHeading;
      }
      return prevHeading;
    });
  };
  const resetThreads = async () => {
    try {
      // If the current filter is "My Threads," reset to all threads
      const response = await axios.get(
        `${API_URL}/threads?&sort=${sortOption}&search=${currentSearchTerm}&heading=${selectedHeading}`
      );
      setThreads(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserThreads = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/threads?&sort=${sortOption}&search=${currentSearchTerm}&userThread=${userIdentity}`
      );
      setThreads(response.data);
    } catch (error) {
      console.error("Error fetching user threads:", error);
    }
  };
  const handleRevnitro = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/threads?&sort=${sortOption}&search=${currentSearchTerm}&userThread=ttt`
      );
      setThreads(response.data);
    } catch (error) {
      console.error("Error fetching user threads:", error);
    }
  };
  const handleSearch = (e) => {
    const searchTermValue = e.target.value;
    setSearchTerm(searchTermValue);
    axios
      .get(`${API_URL}/threads?sort=${sortOption}&search=${searchTermValue}`)
      .then((response) => {
        setThreads(response.data);
        setCurrentSearchTerm(searchTermValue);
      })
      .catch((error) => console.error(error));
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentSearchTerm("");
    fetchThreads(); // Fetch all threads without the search term
  };
  const toggleTotalCommentsVisibility = (threadId) => {
    closeShareModal();
    setShowComments((prevShowComments) => ({
      ...prevShowComments,
      [threadId]: !prevShowComments[threadId],
    }));
  };
  const hideTotalCommentsVisibility = (threadId) => {
    setShowComments("");
  };
  const toggleCommentsVisibility = (threadId) => {
    setVisibleComments((prevState) => ({
      ...prevState,
      [threadId]: !prevState[threadId],
    }));
  };
  // const handleNextPage = () => setCurrentPage((prevPage) => prevPage + 1);

  // const handlePrevPage = () =>
  //   setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));

  const handleSortChange = (option) => {
    setSortOption(option);
    //setCurrentPage(1);
    fetchThreads();
  };

  const showNotification = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  const handleLike = async (threadId) => {
    try {
      if (!userId) {
        Navigate("/login");
        return;
      }
      const response = await axios.post(`${API_URL}/threads/${threadId}/like`, {
        userId: userId,
      });
      setThreads(
        threads.map((thread) =>
          thread._id === threadId
            ? {
                ...thread,
                likes: response.data.likes,
                likedBy: response.data.likedBy,
              }
            : thread
        )
      );

      if (likedThreads.includes(threadId)) {
        setLikedThreads(likedThreads.filter((id) => id !== threadId));
      } else {
        setLikedThreads([...likedThreads, threadId]);
      }
    } catch (error) {
      console.error("Error handling like:", error.response.data);
    }
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
  const shareOther = (thread) => {
    navigator.share({
      title: thread.title,
      text: thread.title,
      url: `${window.location.origin}/threads/${thread._id}`,
    });
    closeShareModal();
  };
  const closeShareModal = () => {
    setSelectedThread(null);
    setShareModalVisible(false);
  };
  // const renderThreadTitle = (thread) => {
  //   if (searchTerm && thread.title) {
  //     const regex = new RegExp(searchTerm, "gi");
  //     const highlightedTitle = thread.title.replace(
  //       regex,
  //       (match) => `<span class="highlight">${match}</span>`
  //     );

  //     return (
  //       <>
  //         <h3 dangerouslySetInnerHTML={{ __html: highlightedTitle }} />
  //         <h6>
  //           by
  //           <img
  //             src={thread.authorProfilePic}
  //             alt={`${userName}'s ProfilePic`}
  //             style={{
  //               backgroundColor: "cyan",
  //               borderRadius: "50%",
  //               width: "30px",
  //               height: "30px",
  //               objectFit: "cover",
  //             }}
  //           />{" "}
  //           <u>{thread.author}</u> <u>{thread.authorIdentity}</u>
  //           {thread.authorIsAdmin && <>♛</>}-{" "}
  //           {moment(thread.createdAt).fromNow()}
  //         </h6>
  //         <br />#{thread.heading}forum
  //       </>
  //     );
  //   } else {
  //     return (
  //       <>
  //         <Link to={`/threads/${thread._id}`}>
  //           <h3>{thread.title}</h3>
  //         </Link>
  //         <h6>
  //           by
  //           <img
  //             src={thread.authorProfilePic}
  //             alt={`${thread.author}'s ProfilePic`}
  //             style={{
  //               backgroundColor: "cyan",
  //               borderRadius: "50%",
  //               width: "30px",
  //               height: "30px",
  //               //objectFit: "cover",
  //             }}
  //           />{" "}
  //           <u>{thread.author}</u> <u>@{thread.authorIdentity}</u>
  //           {thread.authorIsAdmin && <>♛</>}-{" "}
  //           {moment(thread.createdAt).fromNow()}
  //         </h6>
  //         <br />
  //         <br />#{thread.heading}_forum
  //         <br />
  //       </>
  //     );
  //   }
  // };
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
        views:{thread.views}
        <br />#{thread.heading}_forum
        <br />
      </>
    );
  };
  const renderThreadContent = (thread) => {
    const maxContentLength = 300; // Set your preferred character limit

    // Use highlightedContent directly if available
    if (thread.highlightedContent) {
      return (
        <>
          <div
            dangerouslySetInnerHTML={{ __html: thread.highlightedContent }}
          />
          {/* {thread.content.length > maxContentLength && (
          <span
            className="read-more"
            onClick={() => toggleTotalCommentsVisibility(thread._id)}
          >
            Read More...
          </span>
        )} */}
        </>
      );
    } else {
      // Display the first part of the content and include "Read More" link
      return (
        <>
          <div
            dangerouslySetInnerHTML={{
              __html: thread.content.substring(0, maxContentLength),
            }}
          />
          {thread.content.length > maxContentLength && (
            <span
              className="read-more"
              onClick={() => toggleTotalCommentsVisibility(thread._id)}
            >
              <Link to={`/threads/${thread._id}`}>Read More...</Link>
            </span>
          )}
        </>
      );
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
      setUserProfilePic(newProfilePic);

      // Update the profile picture in the backend
      const sendData = {
        profilePic: newProfilePic,
        userId: userId,
      };

      await axios.put(`${API_URL}/auth/updateProfile`, sendData);

      // Display a success message
      alert("Profile Picture Uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Profile Picture Upload Failed. Please try again.");
    }
  };

  const handleComment = (threadId) => {
    if (!userId) {
      // If not logged in, navigate to the login page
      showNotification("Login to comment");
      Navigate("/login");
      return;
    }

    const commentText = newComments[threadId]?.text.trim();
    if (!commentText) {
      showNotification("Comment text cannot be empty.");
      return;
    }

    // Check if "@" is present in the comment text
    if (commentText.includes("#")) {
      // Extract the text after "@" to find the commenter name
      const commenterName = commentText.split("#")[1].split(" ")[0];
      // Update the state with the commenter name
      setCommenterNames([commenterName]);
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
        setThreads(
          threads.map((thread) =>
            thread._id === threadId ? response.data : thread
          )
        );

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
  // const handleDeleteComment = async (threadId, commentId) => {
  //   try {
  //     await axios.delete(
  //       `${API_URL}/threads/${threadId}/comments/${commentId}`,
  //       { isAdmin: isAdmin }
  //     );
  //     // After successful deletion, update the comments in state
  //     setThreads(
  //       threads.map((thread) => {
  //         if (thread._id === threadId) {
  //           return {
  //             ...thread,
  //             comments: thread.comments.filter(
  //               (comment) => comment._id !== commentId
  //             ),
  //           };
  //         }
  //         return thread;
  //       })
  //     );
  //     showNotification("Comment deleted successfully.");
  //   } catch (error) {
  //     console.error("Error deleting comment:", error);
  //     showNotification("Failed to delete comment. Please try again.");
  //   }
  // };
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
      setThreads(
        threads.map((thread) => {
          if (thread._id === threadId) {
            return {
              ...thread,
              comments: thread.comments.filter(
                (comment) => comment._id !== commentId
              ),
            };
          }
          return thread;
        })
      );

      showNotification("Comment deleted successfully.");
    } catch (error) {
      console.error("Error deleting comment:", error);
      showNotification("Failed to delete comment. Please try again.");
    }
  };
  return (
    <div className="app-container">
      <h1>Revnitro Forum</h1>
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
      <div className="sort-container">
        <span>Sort By:</span>
        <button
          onClick={() => handleSortChange("newest")}
          className={sortOption === "newest" ? "active" : ""}
        >
          Newest First
        </button>
        <button
          onClick={() => handleSortChange("oldest")}
          className={sortOption === "oldest" ? "active" : ""}
        >
          Oldest First
        </button>
        <button
          onClick={() => handleSortChange("mostViews")}
          className={sortOption === "mostViewed" ? "active" : ""}
        >
          Most Viewed
        </button>
      </div>
      <div className="heading-filter-container">
        <span>Filter By Heading:</span>
        <select value={selectedHeading} onChange={handleHeadingChange}>
          <option value="All">All</option>
          <option value="Car">Car</option>
          <option value="Bike">Bike</option>
          <option value="Technical Tips">Technical Tips</option>
          <option value="Rider Tips">Rider Tips</option>
          {isAdmin && <option value="RevNitro">Revnitro</option>}
        </select>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Threads"
          value={searchTerm}
          onChange={(e) => {
            handleSearch(e);
          }}
        />
        {/* {currentSearchTerm ? (
          <button onClick={handleClearSearch}>Clear Search</button>
        ) : (
          <button onClick={handleSearch}>Search</button>
        )} */}
      </div>
      <br />
      <Link to={"/forum-list"}>
        <button>forum</button>
      </Link>
      <button value="RevNitro" onClick={handleRevnitro}>
        RevNitro
      </button>
      <button onClick={fetchUserThreads}>My Threads</button>
      <button onClick={resetThreads}>All Threads</button>
      <br />
      {searchTerm && threads.length === 0 ? (
        <>
          <center>
            No threads available for the search of <strong>{searchTerm}</strong>
          </center>
        </>
      ) : (
        <div className="threads-container">
          <h2>Threads:</h2>
          {userId && (
            <Link to="/user/notifications">
              <button>notification({unreadUserNotifications})</button>
            </Link>
          )}
          {threads.map((thread) => (
            <div key={thread._id} className="thread">
              {renderThreadTitle(thread)}

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
              {renderThreadContent(thread)}
              {/* {thread.highlightedContent} */}
              <br />
              <br />
              <button onClick={() => handleLike(thread._id)}>
                {thread.likedBy.includes(userId) ? "Unlike" : "Like"} (
                {thread.likes})
              </button>
              <button
                onClick={() => {
                  handleShare(thread);
                  hideTotalCommentsVisibility(thread._id);
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
                  className={`share-modal ${
                    shareModalVisible ? "visible" : ""
                  }`}
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
                  <button onClick={() => shareOther(thread)}>Others</button>

                  <button onClick={closeShareModal}>Close</button>
                </div>
              )}

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
                      <Link to={`/threads/${thread._id}`}>
                        <button>Show More</button>
                      </Link>
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
                          <li
                            key={name}
                            onClick={() => handleNameSelection(name)}
                          >
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
            </div>
          ))}
        </div>
      )}

      <div className={`notification-container ${notification ? "show" : ""}`}>
        {notification}
      </div>

      {/* <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous Page
        </button>
        <span>Page {currentPage}</span>
        <button onClick={handleNextPage} disabled={threads.length < 5}>
          Next Page
        </button>
      </div> */}
    </div>
  );
}

export default Home;
