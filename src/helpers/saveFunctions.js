const fs = require("fs");

async function saveNewUser(newUsers) {
  try {
    fs.writeFileSync(
      "./storage/pending_users.json",
      JSON.stringify(newUsers, null, 2)
    );
  } catch (error) {
    console.error("Error saving pending users:", error.message);
  }
}

async function savePendingUser(pendingUsers) {
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
  savePendingUser,
  saveNewUser,
};
