import db from "../config/db/db_conn.js";
import MESSAGES from "../constants/messages.js";

export const getMessages = async (req, res) => {
  const query = req.query;
  const userId = req.params.id;

  try {
    const messages = await db("user_messages")
      .select("*")
      .where({ is_deleted: false, sender_id: userId, ...query });

    res.status(200).json({
      message: MESSAGES.FETCH_SUCCESS,
      response: messages,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const recipientId = req.params.id;
    const message = req.body;

    const [messageId] = await db("user_messages").insert({
      ...message,
      recipient_id: recipientId,
    });

    res.status(201).json({
      message: MESSAGES.MESSAGE_SEND_SUCCESS,
      response: messageId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const query = req.query;
    const messageId = req.params.id;
    const updatedMessage = req.body;

    const message = await db("user_messages")
      .select("*")
      .where({ is_deleted: false, id: messageId, ...query })
      .first()
      .update(updatedMessage);

    if (!message) {
      return res.status(404).json({ message: MESSAGES.MESSAGE_NOT_FOUND });
    }

    res.status(200).json({ message: MESSAGES.MESSAGE_UPDATE_SUCCESS });
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const query = req.query;
    const messageId = req.params.id;

    const message = await db("user_messages")
      .select("*")
      .where({ is_deleted: false, id: messageId, ...query })
      .first()
      .update({ is_deleted: true });

    res
      .status(200)
      .json(
        message
          ? { message: MESSAGES.MESSAGE_DELETE_SUCCESS }
          : { message: MESSAGES.MESSAGE_NOT_FOUND }
      );
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};
