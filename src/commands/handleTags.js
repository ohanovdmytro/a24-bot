const {
  savePendingUser,
  getRegisteredUsers,
  getTagsFromSheet,
} = require("../helpers/utils");

async function handleTags(ctx) {
  const userToModify = ctx.match;

  try {
    const registeredUsers = await getRegisteredUsers(userToModify);

    const tags = await getTagsFromSheet(userToModify);

    const index = registeredUsers.findIndex(
      (user) => user.name === userToModify
    );

    if (index !== -1) {
      const registeredUserObject = registeredUsers[index];

      /* Update user's tags */
      registeredUserObject.tags = tags;

      /* Save the modified user data */
      await savePendingUser(registeredUsers);

      /* Inform the user */
      await ctx.api.sendMessage(
        registeredUserObject.userId,
        `Дякую! Ваші теги збережені, тепер Вам надходитимуть повідомлення, які містять вказані теги`
      );

      await ctx.reply(`Користувач ${userToModify} доданий`);

      /* Logger */
      console.log(
        `${new Date()} -- User ${userToModify} received tags by Admin`
      );
    } else {
      console.log(`User ${userToModify} not found.`);
    }
  } catch (error) {
    console.error("Error adding tags: ", error);
  }
}

module.exports = {
  handleTags,
};
