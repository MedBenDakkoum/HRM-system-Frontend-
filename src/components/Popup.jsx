import React from "react";

const Popup = ({ show, type, message, onClose }) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px 30px",
          borderRadius: "10px",
          minWidth: "300px",
          textAlign: "center",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ color: type === "success" ? "#28a745" : "#dc3545" }}>
          {type === "success" ? "Success" : "Error"}
        </h3>
        <p>{message}</p>
        <button
          onClick={onClose}
          style={{
            marginTop: "15px",
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            background: type === "success" ? "#28a745" : "#dc3545",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Popup;
