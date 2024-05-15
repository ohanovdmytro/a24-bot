function isRegistered(registeredUsers, senderId) {
  return registeredUsers.some((user) => user.userId === senderId);
}

function isPending(pendingUsers, senderId) {
  return pendingUsers.some((user) => user.userId === senderId);
}

function hasOrderLink(message) {
  const pattern = /https:\/\/a24\.biz\/order\/getoneorder\/(\d+)/;
  const match = message.match(pattern);

  if (match) {
    const orderId = match[1];
    const link = `https://a24.biz/order/getoneorder/${orderId}`;

    return [true, link];
  } else {
    return [false, "no_link"];
  }
}

function hasTags(message, registeredUsers) {
  const pattern = /https:\/\/a24\.biz\/order\/getoneorder\/(\d+)/;
  const lowerCaseMessage = message.toLowerCase();
  const matchingUsers = [];

  const isLink = pattern.test(message);

  try {
    if (isLink) {
      for (const user of registeredUsers) {
        const lowerCaseTags = user.tags.map((tag) => tag.toLowerCase());

        for (const tag of lowerCaseTags) {
          const regex = new RegExp(`${tag}`, "i");
          if (regex.test(lowerCaseMessage)) {
            matchingUsers.push(user);
            break;
          }
        }
      }
    }

    return pattern.test(message) && matchingUsers.length > 0
      ? [true, matchingUsers]
      : [false, []];
  } catch (error) {
    console.log("Error getting tags from message: ", error.message);
    return [false, []];
  }
}

module.exports = {
  isRegistered,
  isPending,
  hasOrderLink,
  hasTags,
};
