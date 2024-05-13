const fs = require("fs");

const { isRegistered, isPending } = require("./isFunctions.js");
const {
  getRegisteredUsers,
  getPendingUsers,
  getHelperFromSheet,
} = require("./getFunctions.js");
const { savePendingUser, saveNewUser } = require("./saveFunctions.js");

function senderName(registeredUsers, senderId) {
  const user = registeredUsers.find((user) => user.userId === senderId);
  return user ? user.name : "Unknown";
}

function isMissedOrder(message) {
  const pattern = /https:\/\/a24\.biz\/order\/getoneorder\/(\d+)\sпишут/;
  const match = message.match(pattern);

  if (match) {
    const orderId = match[1];
    const link = `https://a24.biz/order/getoneorder/${orderId}`;

    return [true, link];
  } else {
    return [false, "empty"];
  }
}

module.exports = {
  getRegisteredUsers,
  getPendingUsers,
  getHelperFromSheet,

  savePendingUser,
  saveNewUser,

  isRegistered,
  isPending,

  senderName,
  isMissedOrder,
};
