const {
  getRegisteredUsers,
  getPendingUsers,

  savePendingUser,
  isRegistered,
} = require("../helpers/utils");
require("dotenv").config();

const adminId = process.env.ADMIN_ID;

async function handleAllow(ctx) {
  try {
    const pendingUsers = getPendingUsers();
    const registeredUsers = getRegisteredUsers();

    /* Get pendingsUserId and new name from command */
    const [stringUserId, pendingUserName] = ctx.match.split(",");
    const pendingUserId = Number(stringUserId);

    /* Check if user is already registered */
    if (isRegistered(registeredUsers, pendingUserId)) {
      await ctx.reply("Користувач вже зареєстрований!");
      return;
    }

    /* Get pendingUser object */
    const pendingUserObject = pendingUsers.find(
      (user) => user.userId === pendingUserId
    );

    /* Push user to registered users */
    registeredUsers.push({
      userId: pendingUserId,
      username: pendingUserObject.username,
      name: pendingUserName,
    });

    savePendingUser(registeredUsers);

    /* Send user message for registered */
    await ctx.api.sendMessage(
      pendingUserId,
      `Ви зареєстровані у боті. Ваше імʼя: ${pendingUserName}`
    );

    await ctx.reply(`Користувач ${pendingUserName} доданий`);

    /* Logger */
    console.log(
      `${new Date()} -- User ${pendingUserId} is registered by Admin`
    );
  } catch (error) {
    console.error("Error allowing user: ", error.message);
  }
}

module.exports = {
  handleAllow,
};
