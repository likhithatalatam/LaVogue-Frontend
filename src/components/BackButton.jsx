import React from "react";
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/home");
    }
  };

  return (
    <button type="button" className="back-button" onClick={handleBack}>
      <i className="bi bi-arrow-left"></i>
      Back to
    </button>
  );
}

export default BackButton;
