import React, { useState } from "react";
import axios from "axios";
import styles from "./vids.module.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    biodetails: "",
    country: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    // Ensure all fields (including image) are filled
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.biodetails ||
      !formData.country ||
      !profilePic
    ) {
      setMessage("Please fill out all required fields including profile picture.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("biodetails", formData.biodetails);
    data.append("country", formData.country);
    data.append("profilePic", profilePic);

    try {
      await axios.post("http://localhost:8080/api/user", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Account has been created successfully, you can login now!");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        biodetails: "",
        country: "",
      });
      setProfilePic(null);
    } catch (error) {
      console.error("Error creating user:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Create Account</h2>

        <label>Name*</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Email*</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Password*</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label>Confirm Password*</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <label>Bio Details*</label>
        <textarea name="biodetails" value={formData.biodetails} onChange={handleChange} required />

        <label>Country*</label>
<select
  name="country"
  value={formData.country}
  onChange={handleChange}
  required
  className={styles.select}
>
  <option value="">-- Select Your Country --</option>
  {[
    "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia","Australia","Austria","Azerbaijan",
    "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia",
    "Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada",
    "Cape Verde","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (Brazzaville)","Congo (Kinshasa)","Costa Rica",
    "Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt",
    "El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon",
    "Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana",
    "Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel",
    "Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos",
    "Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi",
    "Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova",
    "Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands",
    "New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau",
    "Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania",
    "Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal",
    "Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea",
    "South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan",
    "Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu",
    "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela",
    "Vietnam","Yemen","Zambia","Zimbabwe"
  ].map((country) => (
    <option key={country} value={country}>{country}</option>
  ))}
</select>


        <label>Profile Picture*</label>
        <input
          type="file"
          name="profilePic"
          onChange={handleFileChange}
          accept="image/*"
          required
        />

        <button type="submit" className={styles.button}>
          Sign Up
        </button>

        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  );
};

export default SignUp;
