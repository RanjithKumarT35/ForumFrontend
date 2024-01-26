import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import API_URL from "../global";
function EditThread() {
  const { threadId } = useParams();
  const [editedThread, setEditedThread] = useState({ title: "", content: "" });
  const [notification, setNotification] = useState(null);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [isAdmin, setIsAdmin] = useState("");
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePath, setImagePath] = useState("");
  const navigate = useNavigate();
  const { title, highlightedContent, heading, content, thumbnail } =
    editedThread;

  //let i = 1;
  useEffect(() => {
    async function fetchThreadDetails() {
      try {
        const response = await axios.post(`${API_URL}/threads/${threadId}`);

        const threadData = response.data;

        setEditedThread({
          title: threadData.title,
          highlightedContent: threadData.highlightedContent,
          thumbnail: threadData.thumbnail,
          heading: threadData.heading,
          content: threadData.content,
        });
      } catch (error) {
        console.error(error);
      }
    }

    fetchThreadDetails();
  }, [threadId]);
  useEffect(() => {
    async function getName() {
      try {
        const response = await axios.get(`${API_URL}/auth/user`);
        if (response.data.userName) {
          setUserName(response.data.userName);
          setUserId(response.data.userId);
          setIsAdmin(response.data.isAdmin);
        } else {
          setUserName("Guest");
        }
      } catch (error) {
        console.error(error);
      }
    }
    getName();
  }, []);
  const updateThread = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        title: title,
        highlightedContent: highlightedContent,
        userId,
        thumbnail: thumbnail,
        heading: heading,
        content: content,
      };

      await axios.put(`${API_URL}/threads/${threadId}`, updatedData);
      showNotification("Thread updated successfully!");
      navigate(`/threads/${threadId}`);
    } catch (error) {
      console.error(error);
    }
  };
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    await handleUpload(file);
  };
  const handleUpload = async (file, isThumbnail = false) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("sampleFile", file);

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // You can use 'percentCompleted' to update a loading indicator
        },
      });

      setLoading(false);

      if (isThumbnail) {
        setEditedThread({ ...editedThread, thumbnail: response.data.link });
      } else {
        if (editorRef.current) {
          const editor = editorRef.current;
          editor.execCommand(
            "mceInsertContent",
            false,
            `<img src="${response.data.link}" alt="Uploaded Image"/>`
          );
          setImagePath(response.data.link);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Error uploading image:", error);
    }
  };
  const handleThumbnail = async (event) => {
    const file = event.target.files[0];
    await handleUpload(file, true);
  };
  const handleUploadThumbnail = async (file, isThumbnail = false) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("sampleFile", file);

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // You can use 'percentCompleted' to update a loading indicator
        },
      });

      setLoading(false);

      if (isThumbnail) {
        setEditedThread({ ...editedThread, thumbnail: response.data.link });
      } else {
        if (editorRef.current) {
          const editor = editorRef.current;
          editor.execCommand(
            "mceInsertContent",
            false,
            `<img src="${response.data.link}" alt="Uploaded Image"/>`
          );
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Error uploading image:", error);
    }
  };
  return (
    <div className="app-container">
      <h1>Edit Thread</h1>

      <div>
        <input type="file" name="sampleFile" onChange={handleFileChange} />
        {loading && <p>Loading...</p>}
        {imagePath && (
          <p>
            Image Path:{" "}
            <img
              src={imagePath}
              alt={imagePath}
              style={{
                backgroundColor: "cyan",
                width: "100",
                height: "200px",
                objectFit: "cover",
              }}
            />
          </p>
        )}
      </div>
      <div className="edit-thread-container">
        <form onSubmit={updateThread}>
          <input
            type="text"
            placeholder="Title"
            value={editedThread.title}
            onChange={(e) =>
              setEditedThread({ ...editedThread, title: e.target.value })
            }
            required
          />
          <br />
          <br />
          <input
            type="text"
            placeholder="highlighted text"
            value={highlightedContent}
            onChange={(e) =>
              setEditedThread({
                ...editedThread,
                highlightedContent: e.target.value,
              })
            }
            required
          />
          <br />
          <br />
          <select
            type="text"
            placeholder="Select the Heading"
            value={heading}
            onChange={(e) =>
              setEditedThread({ ...editedThread, heading: e.target.value })
            }
            required
          >
            <option value="select a heading" disabled>
              select a heading
            </option>
            <option value="Car">Car</option>
            <option value="Bike">Bike</option>
            <option value="Technical Tips">Technical Tips</option>
            <option value="Rider Tips">Rider Tips</option>
            {isAdmin && <option value="RevNitro">Revnitro</option>}
          </select>
          <br />
          <br />
          {/* <div>
            <input type="file" name="sampleFile" onChange={handleThumbnail} />
            {loading && <p>Loading...</p>}

            {editedThread.thumbnail && (
              <p>
                Thumbnail Path:
                <img
                  src={thumbnail}
                  alt={thumbnail}
                  style={{
                    backgroundColor: "cyan",
                    width: "100",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              </p>
            )}
          </div> */}
          <div>
            <input type="file" name="sampleFile" onChange={handleThumbnail} />
            {loading && <p>Loading...</p>}

            {thumbnail && (
              <p>
                Thumbnail Path:
                <img
                  src={thumbnail}
                  alt={thumbnail}
                  style={{
                    backgroundColor: "cyan",
                    width: "100",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              </p>
            )}
          </div>
          <br />
          <br />
          <Editor
            apiKey="2edzfx0mgryctyfre9pj8d0fikd96259j7w4wvz15jcfma3g"
            //initialValue={newThread.content}
            //onInit={(evt, editor) => (editorRef.current = editor)}
            init={{
              plugins:
                "ai tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss",
              toolbar1:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough  | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
              toolbar2: "link image media table mergetags | align lineheight",
              tinycomments_mode: "embedded",
              tinycomments_author: "Author name",
              mergetags_list: [
                { value: "First.Name", title: "First Name" },
                { value: "Email", title: "Email" },
              ],
              ai_request: (request, respondWith) =>
                respondWith.string(() =>
                  Promise.reject("See docs to implement AI Assistant")
                ),
              setup: (editor) => {
                editorRef.current = editor; // Save the editor instance to the ref
              },
            }}
            initialValue={content}
            onEditorChange={(content) => {
              setEditedThread({ ...editedThread, content });
            }}
          />
          <button type="submit">Update Thread</button>
        </form>
      </div>
      <div className={`notification-container ${notification ? "show" : ""}`}>
        {notification}
      </div>
    </div>
  );
}
export default EditThread;
