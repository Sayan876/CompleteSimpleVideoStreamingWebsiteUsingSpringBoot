import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import style from "./vids.module.css";

const Navbar = () => {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/SearchList/${title}`);
  };

  return (
    <nav className={style.navbar}>
      <div className={style.leftSection}>
        <h2 className={style.logo}>MyStream</h2>
      </div>

      <form
        className={style.searchContainer}
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <input
          className={style.searchBar}
          type="text"
          placeholder="Search title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className={style.searchButton}>Search</button>
      </form>

      <div className={style.rightSection}>
        <Link to="/ListOfVideos" className={style.navLink}>Home</Link>
        <Link to="/Login" className={style.navLink}>Login</Link>
        <Link to="/SignUp" className={style.signUpBtn}>Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;
