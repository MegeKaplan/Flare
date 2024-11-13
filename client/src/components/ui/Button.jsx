import React from "react";

const Button = ({
  text = "Button",
  color = "primary",
  className = "",
  ...props
}) => {
  return (
    <button
      className={
        `w-full p-2 outline-none rounded transition bg-${color}-400 hover:brightness-90` +
        ` ${className}`
      }
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
