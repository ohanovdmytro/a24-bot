function isRegistered(registeredUsers, senderId) {
  return registeredUsers.some((user) => user.userId === senderId);
}
function isPending(pendingUsers, senderId) {
  return pendingUsers.some((user) => user.userId === senderId);
}

module.exports = {
  isRegistered,
  isPending,
};
