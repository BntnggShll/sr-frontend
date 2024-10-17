import React from "react";
const Register = () => {
  return (
    <div className="register-container">
      <div className="background-image-register"></div>
      <img src="../img/register.jpg" alt="Side Image" className="image-register" />

      <div className="form-section-register">
        <h1 className="register-title">Register</h1>

        <label htmlFor="name" className="input-label-register">Name</label>
        <input type="text" id="name" className="input-box-register" />

        <label htmlFor="email" className="input-label-register">Your Email</label>
        <input type="email" id="email" className="input-box-register" />

        <label htmlFor="password" className="input-label-register">Password</label>
        <input type="password" id="password" className="input-box-register" />

        <label htmlFor="phone" className="input-label-register">Phone Number</label>
        <input type="text" id="phone" className="input-box-register" />

        <label htmlFor="role" className="input-label-register">
            Role
          </label>
          <select id="role" className="input-box-register">
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="pekerja">Pekerja</option>
          </select>

        <button className="register-btn">Register</button>

        <div className="login-link">
          Already have an account? <a href="/login">Sign In</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
