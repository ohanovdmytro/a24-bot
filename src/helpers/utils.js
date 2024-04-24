const fs = require("fs");

function isRegistered(registeredUsers, senderId) {
  return registeredUsers.some((user) => user.userId === senderId);
}
function isPending(pendingUsers, senderId) {
  return pendingUsers.some((user) => user.userId === senderId);
}

function senderName(registeredUsers, senderId) {
  const user = registeredUsers.find((user) => user.userId === senderId);
  return user ? user.name : "Unknown";
}

function loadRegisteredUsers() {
  try {
    const data = fs.readFileSync("./storage/registered_users.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading registered users:", error.message);
    return [];
  }
}

function loadPendingUsers() {
  try {
    const data = fs.readFileSync("./storage/pending_users.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading pending users:", error.message);
    return [];
  }
}

function saveNewUser(newUsers) {
  try {
    fs.writeFileSync(
      "./storage/pending_users.json",
      JSON.stringify(newUsers, null, 2)
    );
  } catch (error) {
    console.error("Error saving pending users:", error.message);
  }
}

function savePendingUser(pendingUsers) {
  console.log(pendingUsers);
  try {
    fs.writeFileSync(
      "./storage/registered_users.json",
      JSON.stringify(pendingUsers, null, 2)
    );
  } catch (error) {
    console.error("Error saving pending users:", error.message);
  }
}

module.exports = {
  loadRegisteredUsers,
  loadPendingUsers,

  savePendingUser,
  saveNewUser,

  senderName,

  isRegistered,
  isPending,
};
