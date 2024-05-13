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
    const senderId = ctx.message.from?.id;
    const pendingUsers = getPendingUsers();
    const registeredUsers = getRegisteredUsers();

    /* Get pendingsUserId and new name from command */
    const [stringUserId, pendingUserName] = ctx.match.split(",");
    const pendingUserId = Number(stringUserId);

    /* Check for admin */
    if (senderId === Number(adminId)) {
      /* Check if user is already registered */
      if (isRegistered(registeredUsers, pendingUserId)) {
        await ctx.reply("Пользователь уже зарегистрирован!");
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

      /* Send user WebApp for filters */
      await ctx.api.sendMessage(
        pendingUserId,
        `Вы зарегистрированы в боте. Ваше имя: ${pendingUserName}`
      );

      await ctx.reply(`Пользователь ${pendingUserName} добавлен`);

      /* Logger */
      console.log(
        `${new Date()} -- User ${pendingUserId} is registered by Admin`
      );
    }
  } catch (error) {
    console.error("Error allowing user: ", error.message);
  }
}

module.exports = {
  handleAllow,
};
