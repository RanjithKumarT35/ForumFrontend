// HeadingListPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import API_URL from "../global";
function HeadingListPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/forum/`);
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching forum stats:", error);
      }
    };

    fetchStats();
  }, []);
  const formatTimeAgo = (timestamp) => {
    return moment(timestamp).fromNow();
  };
  return (
    <div>
      <h2>Forum Statistics</h2>
      {stats ? (
        <div>
          <p>Total Threads: {stats.totalThreads}</p>
          <p>Total Headings: {stats.totalHeadings}</p>
          <p>Total Views: {stats.totalViews}</p>

          <h3>Heading Details:</h3>
          <ul>
            {stats.headingDetails.map((heading) => (
              <li key={heading.heading}>
                <Link to={`/home/${heading.heading}`}>
                  {/* Add Link to navigate to home with query parameter */}
                  <p>Heading: {heading.heading}</p>
                </Link>
                <p>Post Count: {heading.postCount}</p>
                {heading.latestThread && (
                  <>
                    <p>Latest Thread:</p>
                    <p>Title: {heading.latestThread.title}</p>
                    <p>
                      Created At:{" "}
                      {formatTimeAgo(heading.latestThread.createdAt)}
                    </p>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading forum stats...</p>
      )}
    </div>
  );
}

export default HeadingListPage;
