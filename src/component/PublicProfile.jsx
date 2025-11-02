import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

const PublicProfile = () => {
  const { abc } = useParams();
  const [user, setUser] = useState({});
  const [vids, setVids] = useState([]);
  const videoRefs = useRef([]);

  // Fetch user data
  useEffect(() => {
    axios.get(`http://localhost:8080/api/user/${abc}`)
      .then(resp => setUser(resp.data))
      .catch(err => console.log(err));
  }, [abc]);

  // Fetch videos
  useEffect(() => {
    axios.get(`http://localhost:8080/api/v3/videos/byUserId/${abc}`)
      .then(resp => setVids(resp.data))
      .catch(err => console.log(err));
  }, [abc]);

  // Handle playing only one video at a time
  const handlePlay = (index) => {
    videoRefs.current.forEach((vid, i) => {
      if (vid && i !== index) vid.pause();
    });
  };

  return (
    <div style={styles.page}>
      {/* ---------- User Info ---------- */}
      <div style={styles.profileCard}>
        <img 
          src={`http://localhost:8080/api/user/image/${user.id}`} 
          alt="Profile" 
          style={styles.profileImage}
        />
        <h2 style={styles.userName}>{user.name}</h2>
        <p style={styles.userEmail}>{user.email}</p>
        <p style={styles.userCountry}>{user.country}</p>
        <p style={styles.userBio}>{user.biodetails}</p>
        <p style={styles.userSince}>Member since: {new Date(user.accountCreatedAt).toLocaleDateString()}</p>
      </div>

      {/* ---------- Videos ---------- */}
      <div style={styles.videosContainer}>
        {vids.map((vid, index) => (
          <div key={vid.videoId} style={styles.videoCard}>
            <video
              width="100%"
              controls
              ref={el => videoRefs.current[index] = el}
              onPlay={() => handlePlay(index)}
              style={styles.videoPlayer}
            >
              <source src={`http://localhost:8080/api/v3/videos/stream/${vid.videoId}`} />
            </video>
            <div style={styles.videoInfo}>
              <h3 style={styles.videoTitle}>{vid.title}</h3>
              <p style={styles.videoDesc}>{vid.description}</p>
              <p style={styles.uploadedAt}>Uploaded: {new Date(vid.uploadedAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------- Styles ----------
const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f0f, #1a1a1a)',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  profileCard: {
    background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)',
    borderRadius: '20px',
    padding: '2.5rem',
    textAlign: 'center',
    boxShadow: '0 12px 40px rgba(0,0,0,0.8)',
    marginBottom: '3rem',
    width: '400px',
  },
  profileImage: {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    border: '4px solid #f39c12',
    objectFit: 'cover',
    boxShadow: '0 0 20px rgba(243,156,18,0.7)',
    marginBottom: '1rem',
  },
  userName: { fontSize: '1.8rem', color: '#f39c12', margin: '0.5rem 0' },
  userEmail: { color: '#ccc', margin: '0.2rem 0' },
  userCountry: { color: '#ccc', margin: '0.2rem 0' },
  userBio: { color: '#aaa', margin: '0.5rem 0' },
  userSince: { color: '#888', fontSize: '0.85rem', marginTop: '0.5rem' },

  videosContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '2rem',
    width: '100%',
    maxWidth: '1200px',
  },
  videoCard: {
    background: '#222',
    borderRadius: '15px',
    padding: '1rem',
    boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s',
  },
  videoPlayer: { borderRadius: '12px', marginBottom: '0.8rem' },
  videoInfo: { padding: '0 0.5rem', color: '#fff' },
  videoTitle: { fontSize: '1.2rem', color: '#f39c12', marginBottom: '0.3rem' },
  videoDesc: { fontSize: '0.95rem', color: '#ccc', marginBottom: '0.3rem' },
  uploadedAt: { fontSize: '0.8rem', color: '#aaa' },
};

export default PublicProfile;
