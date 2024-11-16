import React from "react";

const COLORS = {
  primary: "bg-primary-400",
  secondary: "bg-secondary-400",
  indigo: "bg-indigo-400",
  danger: "bg-red-400",
};

const Button = ({
  text = "Button",
  color = "primary",
  className = "",
  ...props
}) => {
  return (
    <button
      className={
        `w-full p-2 outline-none rounded transition ${
          COLORS[color] || COLORS.primary
        } hover:brightness-90` + ` ${className}`
      }
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
