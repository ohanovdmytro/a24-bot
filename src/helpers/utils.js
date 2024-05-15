const fs = require("fs");

const {
  isRegistered,
  isPending,
  hasOrderLink,
  hasTags,
} = require("./stateFunctions.js");
const {
  getRegisteredUsers,
  getPendingUsers,
  getHelperFromSheet,
  getTagsFromSheet,
} = require("./getFunctions.js");
const { savePendingUser, saveNewUser } = require("./saveFunctions.js");

function senderName(registeredUsers, senderId) {
  const user = registeredUsers.find((user) => user.userId === senderId);
  return user ? user.name : "Unknown";
}

module.exports = {
  getRegisteredUsers,
  getPendingUsers,
  getHelperFromSheet,
  getTagsFromSheet,

  savePendingUser,
  saveNewUser,

  isRegistered,
  isPending,
  hasOrderLink,

  senderName,
  hasTags,
};
