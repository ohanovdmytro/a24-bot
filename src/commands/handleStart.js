const {
  loadRegisteredUsers,
  loadPendingUsers,

  isRegistered,
  isPending,

  saveNewUser,
} = require("../helpers/utils");

async function handleStart(ctx) {
  try {
    const newUserId = ctx.message.from.id;
    const newUsername = ctx.message.from.username;
    const newFirstName = ctx.message.from.first_name;

    const pendingUsers = loadPendingUsers();
    const registeredUsers = loadRegisteredUsers();

    /* Check if user is  in pending or registered, otherwise - ask Viktor */
    if (
      !isPending(pendingUsers, newUserId) &&
      !isRegistered(registeredUsers, newUserId)
    ) {
      /* Push user to pending */
      pendingUsers.push({
        userId: newUserId,
        username: newUsername,
        name: newFirstName,
      });

      /* Push user to pending users */
      saveNewUser(pendingUsers);

      await ctx.reply(
        `Напишите @Viktor_Rachuk и ожидайте начала подтверждения работы`
      );

      /* Logger */
      console.log(`${new Date()} -- User ${newUserId} is in the bot`);
    } else if (
      isPending(pendingUsers, newUserId) &&
      !isRegistered(registeredUsers, newUserId)
    ) {
      await ctx.reply(`Доступ еще не активирован. Связь: @Viktor_Rachuk`);
    } else if (isRegistered(registeredUsers, newUserId)) {
      await ctx.reply("Вы уже зарегистрированы.");
    }
  } catch (error) {
    console.error("Error registering: ", error.message);
  }
}

module.exports = {
  handleStart,
};
