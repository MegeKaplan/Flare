import React, { useState } from "react";

const CommentItem = ({ data, className }) => {
  if (data === undefined) {
    return null;
  }
  const [messageData, setMessageData] = useState(data);

  return (
    <div
      key={messageData.id}
      className={
        `flex m-1 p-1 px-4 w-10/12 text-secondary-900 text-pretty` +
        ` ${className}`
      }
    >
      <p className="overflow-hidden">{messageData.text}</p>
    </div>
  );
};

export default CommentItem;
