const fs = require("fs");

function isRegistered(registeredUsers, senderId) {
  return registeredUsers.some((user) => user.userId === senderId);
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

function saveRegisteredUsers(registeredUsers) {
  try {
    fs.writeFileSync(
      "./storage/registered_users.json",
      JSON.stringify(registeredUsers, null, 2)
    );
  } catch (error) {
    console.error("Error saving registered users:", error.message);
  }
}

module.exports = {
  loadRegisteredUsers,
  saveRegisteredUsers,
  senderName,
  isRegistered,
};
