import React from "react";

const Pill = ({ image, text, onClick }) => {
  return (
    <>
      <span className="user-pill">
        <img src={image} alt={text} />
        <span>
          {text} <span onClick={onClick}>&times;</span>
        </span>
      </span>
    </>
  );
};

export default Pill;
