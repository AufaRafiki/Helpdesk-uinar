// components/PasswordField.jsx
import React, { useState } from "react";

const PasswordField = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="input-group">
      <input
        type={showPassword ? "text" : "password"}
        className="form-control bg-transparent"
        placeholder="Password"
        value={value}
        onChange={onChange}
      />
      <button
        className="btn btn-outline-secondary"
        type="button"
        onClick={togglePasswordVisibility}
      >
        <span className="material-symbols-outlined">
          {showPassword ? "visibility_off" : "visibility"}
        </span>
      </button>
    </div>
  );
};

export default PasswordField;
