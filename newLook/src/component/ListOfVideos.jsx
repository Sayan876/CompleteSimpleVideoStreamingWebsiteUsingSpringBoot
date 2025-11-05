import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import style from "./vids.module.css";

const ListOfVideos = () => {
  const [videos, setVideos] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const videoRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideosAndUsers = async () => {
      try {
        const videoResponse = await axios.get("http://localhost:8080/api/v3/videos");
        const videoList = videoResponse.data;
        setVideos(videoList);

        const userDataPromises = videoList.map(async (vid) => {
          try {
            const userIdResp = await axios.get(
              `http://localhost:8080/api/v3/videos/getUserIdByVideoId/${vid.videoId}`
            );
            const userId = userIdResp.data;

            const userResp = await axios.get(`http://localhost:8080/api/user/${userId}`);
            const userName = userResp.data.name || "Unknown User";
            const userImage = `http://localhost:8080/api/user/image/${userId}`;

            return { videoId: vid.videoId, userId, userName, userImage };
          } catch (err) {
            console.error("Error fetching user for video:", vid.videoId);
            return { videoId: vid.videoId, userId: "N/A", userName: "Unknown", userImage: null };
          }
        });

        const userResults = await Promise.all(userDataPromises);

        const userMap = {};
        userResults.forEach(({ videoId, userId, userName, userImage }) => {
          userMap[videoId] = { userId, userName, userImage };
        });

        setUserDetails(userMap);
      } catch (err) {
        console.error("Error fetching videos:", err);
      }
    };

    fetchVideosAndUsers();
  }, []);

  const handlePlay = (index) => {
    videoRefs.current.forEach((video, i) => {
      if (video && i !== index) video.pause();
    });
  };

  // ✅ Navigate to user's public profile
  const handleUserClick = (userId) => {
    navigate(`/PublicProfile/${userId}`);
  };

  return (
    <div className={style.pageContainer}>
      <h1 className={style.header}>🎬 Explore Latest Videos</h1>
      <div className={style.videoGrid}>
        {videos.map((vid, index) => (
          <div key={vid.videoId} className={style.videoCard}>
            <div className={style.videoWrapper}>
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                onPlay={() => handlePlay(index)}
                controls
                className={style.videoPlayer}
              >
                <source src={`http://localhost:8080/api/v3/videos/stream/${vid.videoId}`} />
              </video>
            </div>

            <div className={style.videoInfo}>
              <div
                className={style.userSection}
                onClick={() => handleUserClick(userDetails[vid.videoId]?.userId)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={userDetails[vid.videoId]?.userImage}
                  alt={`${userDetails[vid.videoId]?.userName || "User" } profile`}
                  className={style.userImage}
                />
                <div>
                  <p className={style.userName}>{userDetails[vid.videoId]?.userName || "Loading..."}</p>
                  <p className={style.videoTitle}>{vid.title}</p>
                </div>
              </div>

              <p className={style.videoDescription}>{vid.description}</p>
              <p className={style.uploadedAt}>Uploaded: {new Date(vid.uploadedAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListOfVideos;
