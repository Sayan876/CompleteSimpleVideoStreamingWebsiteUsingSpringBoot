import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserDetails.module.css"; // 👈 Import the CSS module

const UserDetails = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({ title: "", description: "" });
  const [profileFile, setProfileFile] = useState(null);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileEditData, setProfileEditData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    country: "",
    biodetails: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    file: null,
  });
  const [uploading, setUploading] = useState(false);
  const videoRefs = useRef([]);

  // ---------------- Fetch User ----------------
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const storedId = localStorage.getItem("userId");

    if (!isLoggedIn || !storedId) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:8080/api/user/${storedId}`)
      .then((resp) => setUser(resp.data))
      .catch(() => {
        console.log("Cannot fetch user data");
        navigate("/login");
      });
  }, [navigate]);

  const fetchVideos = () => {
    if (!user?.id) return;

    axios
      .get(`http://localhost:8080/api/v3/videos/byUserId/${user.id}`)
      .then((resp) => setVideos(resp.data))
      .catch(() => console.log("Cannot fetch videos"));
  };

  useEffect(() => {
    fetchVideos();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handlePlay = (index) => {
    videoRefs.current.forEach((vid, i) => {
      if (vid && i !== index) vid.pause();
    });
  };

  // ---------------- Video Edit/Delete ----------------
  const startEdit = (index) => {
    setEditingIndex(index);
    setEditData({
      title: videos[index].title,
      description: videos[index].description,
    });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditData({ title: "", description: "" });
  };

  const saveEdit = async (videoId) => {
    try {
      const formData = new FormData();
      formData.append("title", editData.title.trim());
      formData.append("description", editData.description.trim());

      await axios.patch(`http://localhost:8080/api/v3/videos/${videoId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchVideos();
      cancelEdit();
    } catch (err) {
      console.log("Error updating video", err);
    }
  };

  const deleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/v3/videos/${videoId}`);
      fetchVideos();
    } catch (err) {
      console.log("Error deleting video", err);
    }
  };

  // ---------------- Profile Picture ----------------
  const handleFileChange = (e) => setProfileFile(e.target.files[0]);

  const uploadProfilePic = async () => {
    if (!profileFile) return;
    try {
      const formData = new FormData();
      formData.append("profilePic", profileFile);

      const userId = localStorage.getItem("userId");
      await axios.patch(`http://localhost:8080/api/user/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const resp = await axios.get(`http://localhost:8080/api/user/${userId}`);
      setUser(resp.data);
      setProfileFile(null);
      alert("Profile picture updated!");
    } catch (err) {
      console.log("Error uploading profile picture", err);
    }
  };

  const deleteProfilePic = async () => {
    if (!window.confirm("Are you sure you want to delete your profile picture?")) return;
    try {
      const userId = localStorage.getItem("userId");
      await axios.delete(`http://localhost:8080/api/user/delpro/${userId}`);
      const resp = await axios.get(`http://localhost:8080/api/user/${userId}`);
      setUser(resp.data);
      alert("Profile picture deleted!");
    } catch (err) {
      console.log("Error deleting profile picture", err);
    }
  };

  // ---------------- Edit Profile Details ----------------
  const openProfileEdit = () => {
    setProfileEditData({
      name: user.name || "",
      password: user.password ||"",
      confirmPassword: user.password || "",
      country: user.country || "",
      biodetails: user.biodetails || "",
    });
    setPasswordError("");
    setShowProfileEdit(true);
  };

  const closeProfileEdit = () => setShowProfileEdit(false);

  // live password check
  useEffect(() => {
    if (profileEditData.password && profileEditData.confirmPassword) {
      if (profileEditData.password !== profileEditData.confirmPassword) {
        setPasswordError("⚠️ Passwords do not match!");
      } else {
        setPasswordError("");
      }
    } else {
      setPasswordError("");
    }
  }, [profileEditData.password, profileEditData.confirmPassword]);

  const saveProfileChanges = async () => {
    if (passwordError) return;

    try {
      const userId = localStorage.getItem("userId");
      const formData = new FormData();
      formData.append("name", profileEditData.name);
      formData.append("password", profileEditData.password);
      formData.append("country", profileEditData.country);
      formData.append("biodetails", profileEditData.biodetails);

      await axios.patch(`http://localhost:8080/api/userdet/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const resp = await axios.get(`http://localhost:8080/api/user/${userId}`);
      setUser(resp.data);
      setShowProfileEdit(false);
      alert("Profile details updated successfully!");
    } catch (err) {
      console.log("Error updating profile details", err);
      alert("Failed to update profile details.");
    }
  };

  // ---------------- Video Upload Feature ----------------
  const handleVideoChange = (e) => setUploadData({ ...uploadData, file: e.target.files[0] });

  const handleUpload = async () => {
    if (!uploadData.file || !uploadData.title) {
      alert("Please select a video file and enter a title!");
      return;
    }
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", uploadData.file);
      formData.append("title", uploadData.title.trim());
      formData.append("description", uploadData.description.trim());

      await axios.post(`http://localhost:8080/api/v3/videos/${user.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      alert("Video uploaded successfully!");
      setUploadData({ title: "", description: "", file: null });
      setUploadProgress(0);
      fetchVideos();
    } catch (err) {
      console.log("Error uploading video", err);
      alert("Failed to upload video!");
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm("⚠️ Are you sure you want to delete your account permanently? This action cannot be undone.")) return;

    try {
      const userId = localStorage.getItem("userId");
      await axios.delete(`http://localhost:8080/api/user/${userId}`);
      alert("Your account has been deleted successfully.");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userId");
      navigate("/signup");
    } catch (err) {
      console.error("Error deleting account:", err);
      alert("Failed to delete account. Please try again later.");
    }
  };

  if (!user) return <p style={{ color: "white" }}>Loading user...</p>;

  // ---------------- Render ----------------
  return (
    <div className={styles.page}>
      {/* ---------- Profile Card ---------- */}
      <div className={styles.profileCard}>
        <div className={styles.imageContainer}>
          <img
            src={`http://localhost:8080/api/user/image/${user.id}?t=${Date.now()}`}
            alt="User Profile"
            className={styles.profileImage}
          />
        </div>

        <div className={styles.fileUploadContainer}>
          <label htmlFor="profileUpload" className={styles.chooseFileBtn}>Choose File</label>
          <input type="file" id="profileUpload" onChange={handleFileChange} style={{ display: "none" }} />
          <button onClick={uploadProfilePic} className={styles.uploadBtn}>Upload</button>
          <button onClick={deleteProfilePic} className={styles.deleteProfileBtn}>Delete</button>
        </div>

        <h2 className={styles.name}>{user.name}</h2>
        <p className={styles.email}>{user.email}</p>

        <div className={styles.infoBox}>
          <p><strong>Country:</strong> {user.country}</p>
          <p><strong>About Me:</strong> {user.biodetails}</p>
          <p><strong>Member Since:</strong> {new Date(user.accountCreatedAt).toLocaleDateString()}</p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <button onClick={openProfileEdit} className={styles.editBtn}>Edit Profile Details</button>
          <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
        </div>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <button onClick={deleteAccount} className={styles.deleteAccountBtn}>
            Delete Account
          </button>
        </div>
      </div>

      {/* ---------- Upload New Video Section ---------- */}
      <div className={styles.uploadSection}>
        <h2 className={styles.uploadHeading}>🎬 Upload Your New Video</h2>
        <p className={styles.uploadSubText}>
          Share your creativity with the world! Fill in the details below and upload your masterpiece.
        </p>

        <div className={styles.uploadForm}>
          <input
            type="text"
            placeholder="Enter video title"
            value={uploadData.title}
            onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
            className={styles.inputLarge}
          />
          <textarea
            placeholder="Write a catchy description..."
            value={uploadData.description}
            onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
            className={styles.textareaLarge}
          />
          <input type="file" accept="video/*" onChange={handleVideoChange} className={styles.fileInput} />

          <button onClick={handleUpload} className={styles.bigUploadBtn} disabled={uploading}>
            {uploading ? "Uploading..." : "🚀 Upload Video"}
          </button>

          {uploading && (
            <div className={styles.progressContainer}>
              <div className={styles.progressBar} style={{ width: `${uploadProgress}%` }}>
                <span className={styles.progressText}>{uploadProgress}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------- Videos Section ---------- */}
      <div className={styles.videosContainer}>
        {videos.length === 0 && <p style={{ color: "#ccc" }}>No videos uploaded yet.</p>}
        {videos.map((vid, index) => (
          <div key={vid.videoId} className={styles.videoCard}>
            <video
              width="100%"
              controls
              ref={(el) => (videoRefs.current[index] = el)}
              onPlay={() => handlePlay(index)}
              className={styles.video}
            >
              <source src={`http://localhost:8080/api/v3/videos/stream/${vid.videoId}`} />
            </video>

            {editingIndex === index ? (
              <div className={styles.editBox}>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className={styles.input}
                  placeholder="Video Title"
                />
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className={styles.textarea}
                  placeholder="Video Description"
                />
                <div className={styles.buttonGroup}>
                  <button onClick={() => saveEdit(vid.videoId)} className={styles.saveBtn}>Save</button>
                  <button onClick={cancelEdit} className={styles.cancelBtn}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className={styles.videoInfo}>
                <h3 className={styles.videoTitle}>{vid.title}</h3>
                <p className={styles.videoDesc}>{vid.description}</p>
                <span className={styles.uploadedAt}>{new Date(vid.uploadedAt).toLocaleString()}</span>
                <div className={styles.buttonGroup}>
                  <button onClick={() => startEdit(index)} className={styles.editBtn}>Update</button>
                  <button onClick={() => deleteVideo(vid.videoId)} className={styles.deleteBtn}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ---------- Edit Profile Modal ---------- */}
      {showProfileEdit && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 style={{ color: "#f39c12", textAlign: "center" }}>Edit Profile</h2>

            <input
              type="text"
              placeholder="Full Name"
              value={profileEditData.name}
              onChange={(e) => setProfileEditData({ ...profileEditData, name: e.target.value })}
              className={styles.input}
            />
            <input
              type="password"
              placeholder="New Password"
              value={profileEditData.password}
              onChange={(e) => setProfileEditData({ ...profileEditData, password: e.target.value })}
              className={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={profileEditData.confirmPassword}
              onChange={(e) => setProfileEditData({ ...profileEditData, confirmPassword: e.target.value })}
              className={styles.input}
              required
            />
            {passwordError && <p style={{ color: "red", fontSize: "0.9rem" }}>{passwordError}</p>}

            <select
  value={profileEditData.country}
  onChange={(e) =>
    setProfileEditData({ ...profileEditData, country: e.target.value })
  }
  className={styles.select}
>
  <option value="">Select your country</option>
  {[
    "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina",
    "Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados",
    "Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina",
    "Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia",
    "Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros",
    "Congo (Congo-Brazzaville)","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic",
    "Democratic Republic of the Congo","Denmark","Djibouti","Dominica","Dominican Republic",
    "Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini",
    "Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece",
    "Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary",
    "Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan",
    "Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon",
    "Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi",
    "Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico",
    "Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar",
    "Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria",
    "North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine State",
    "Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar",
    "Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia",
    "Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe",
    "Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia",
    "Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain",
    "Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan",
    "Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia",
    "Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom",
    "United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam",
    "Yemen","Zambia","Zimbabwe"
  ].map((country) => (
    <option key={country} value={country}>
      {country}
    </option>
  ))}
</select>

            <textarea
              placeholder="Bio / About Me"
              value={profileEditData.biodetails}
              onChange={(e) => setProfileEditData({ ...profileEditData, biodetails: e.target.value })}
              className={styles.textarea}
            />

            <div className={styles.buttonGroup}>
              <button
                onClick={saveProfileChanges}
                className={styles.saveBtn}
                disabled={passwordError !== "" || !profileEditData.name}
                style={{
                  opacity: passwordError !== "" ? 0.6 : 1,
                  cursor: passwordError !== "" ? "not-allowed" : "pointer",
                }}
              >
                Save
              </button>
              <button onClick={closeProfileEdit} className={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
