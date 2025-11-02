import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [triggerLogin, setTriggerLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  let [userId,setUserId]=useState("");

  // 👇 useEffect handles the actual login logic
  useEffect(() => {
    const loginUser = async () => {
      if (!triggerLogin) return; // prevent auto run on first render
      setLoading(true);
      setError("");

      axios
        .post(`http://localhost:8080/api/verify-by-pass?email=${email}&password=${password}`)
        .then((response) => {
           const user = response.data;
           // ✅ Save login flag or token
           localStorage.setItem("isLoggedIn", "true");
           localStorage.setItem("userId", user.id);
          navigate(`/Userdetials/${user.id}`);
        })
        .catch(() => {
          setError("Invalid email or password");
        })
        .finally(() => {
          setLoading(false);
          setTriggerLogin(false);
        });
    };

    loginUser();
  }, [triggerLogin, email, password, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setTriggerLogin(true); // ✅ triggers useEffect
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#121212",
  },
  form: {
    background: "#1e1e1e",
    padding: "2rem",
    borderRadius: "12px",
    color: "white",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "300px",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #444",
    background: "#222",
    color: "white",
  },
  button: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    background: "#f39c12",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
};

export default Login;
